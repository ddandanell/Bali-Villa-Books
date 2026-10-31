import { createHash } from "node:crypto";
import framework from "../../../../lib/site-content/src/editorial-framework.json";
import { similarTitle } from "./blog-policy";

export type ResearchObservation = {
  sourceId: string; url: string; kind: string; retrievedAt: string;
  state: "observed" | "unavailable"; fingerprint?: string; headings?: string[];
  changedSinceLastObservation?: boolean; reason?: string;
};
export type EditorialResearch = {
  version: string; siteId: string; checkedAt: string;
  observations: ResearchObservation[]; limitations: string[];
  keywordEvidenceDate: string; priorOperationalObservations: unknown[];
};

const normalize = (value: string) => value.normalize("NFKC").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const plain = (value: string) => value.replace(/<[^>]*>/g, " ").replace(/&(?:amp|nbsp);/g, " ").replace(/&[^;]{1,12};/g, " ").replace(/\s+/g, " ").trim();

/** Headings are discovery observations, never verified tax rules or instructions. */
export function extractResearchHeadings(html: string): string[] {
  const clean = html.replace(/<(script|style|nav|header|footer)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  return [...new Set([...clean.matchAll(/<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/gi)]
    .map(match => plain(match[1])).filter(title => title.length >= 15 && title.length <= 180))].slice(0, 8);
}

async function observeSource(source: typeof framework.sources[number], fetcher: typeof fetch, at: Date): Promise<ResearchObservation> {
  const base = { sourceId: source.id, url: source.url, kind: source.kind, retrievedAt: at.toISOString() };
  try {
    // Only repository-configured HTTPS sources; never follow an external page to another host.
    if (new URL(source.url).protocol !== "https:") throw new Error("unsupported-protocol");
    const response = await fetcher(source.url, { signal: AbortSignal.timeout(12000), redirect: "error" });
    if (!response.ok) return { ...base, state: "unavailable", reason: `HTTP ${response.status}` };
    if (!/text\/(?:html|plain)/i.test(response.headers.get("content-type") ?? ""))
      return { ...base, state: "unavailable", reason: "unsupported-content-type" };
    const reader = response.body?.getReader();
    if (!reader) throw new Error("empty-body");
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const item = await reader.read();
        if (item.done) break;
        size += item.value.byteLength;
        if (size > 350000) break;
        chunks.push(item.value);
      }
    } finally { await reader.cancel(); }
    const html = Buffer.concat(chunks).toString("utf8");
    const headings = extractResearchHeadings(html);
    if (!headings.length) return { ...base, state: "unavailable", reason: "no-readable-headings" };
    return { ...base, state: "observed", headings,
      fingerprint: createHash("sha256").update(JSON.stringify(headings)).digest("hex") };
  } catch {
    // Do not leak provider responses or connection details into prompts and reports.
    return { ...base, state: "unavailable", reason: "fetch-failed" };
  }
}

export async function collectEditorialResearch(options: {
  at?: Date; previous?: ResearchObservation[]; priorOperationalObservations?: unknown[];
  fetcher?: typeof fetch;
} = {}): Promise<EditorialResearch> {
  const at = options.at ?? new Date();
  const observations: ResearchObservation[] = [];
  // Bounded network work, with at most two source requests at once.
  for (let index = 0; index < framework.sources.length; index += 2) {
    observations.push(...await Promise.all(framework.sources.slice(index, index + 2)
      .map(source => observeSource(source, options.fetcher ?? fetch, at))));
  }
  for (const observation of observations) {
    const previous = options.previous?.find(item => item.sourceId === observation.sourceId && item.state === "observed");
    if (previous?.fingerprint && observation.fingerprint)
      observation.changedSinceLastObservation = observation.fingerprint !== previous.fingerprint;
  }
  return { version: framework.version, siteId: framework.siteId, checkedAt: at.toISOString(), observations,
    keywordEvidenceDate: framework.keywordEvidenceDate,
    priorOperationalObservations: (options.priorOperationalObservations ?? []).slice(0, 3),
    limitations: [
      "Headings and changes are discovery signals, not verified rules or evidence of competitor traffic or sales.",
      "A failed source fetch is unavailable evidence, not no news.",
      "Saved keyword demand is dated; no current Search Console or GA4 connection has been verified.",
      "Local views and CTA clicks are not organic visits, completed enquiries or qualified leads.",
      "Prior audit observations are not approved causal lessons or authority to rewrite instructions."
    ] };
}

/** A reusable topic can be proposed only if its current intent is still uncovered. */
export function intentAlreadyCovered(topic: { keyword: string; workingTitle: string }, existing: { primaryKeyword: string; title: string }[]): boolean {
  return existing.some(post => normalize(post.primaryKeyword) === normalize(topic.keyword)
    || similarTitle(post.title, topic.workingTitle));
}

/** Source-bearing briefs and outcome records fit the existing persistent run metadata. */
export function mergeEditorialMetadata(previous: unknown, patch: Record<string, unknown>): Record<string, unknown> {
  const base = previous && typeof previous === "object" && !Array.isArray(previous) ? previous as Record<string, unknown> : {};
  const editorial = base.editorial && typeof base.editorial === "object" && !Array.isArray(base.editorial)
    ? base.editorial as Record<string, unknown> : {};
  return { ...base, editorial: { ...editorial, ...patch } };
}
