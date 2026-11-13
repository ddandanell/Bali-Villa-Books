#!/usr/bin/env node
/** Read-only production audit. Never treat transport errors as editorial evidence. */
import { mkdirSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
const ORIGIN = "https://bali-villa-accounting-service.com";
const MAX_PAGES = 500;
const decode = s => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(m => [m[1].toLowerCase(), decode(m[2] ?? m[3])]));
export function internalUrl(value, base = ORIGIN) {
  try {
    const url = new URL(decode(value), base);
    if (url.origin !== ORIGIN || url.username || url.password) return null;
    url.hash = "";
    // Crawl pagination, never arbitrary query strings or private/form/API routes.
    const page = url.searchParams.get("page");
    url.search = "";
    if (url.pathname === "/blog" && page && /^[1-9]\d{0,3}$/.test(page) && page !== "1") url.searchParams.set("page", page);
    if (/^\/(?:api|_vercel)(?:\/|$)/.test(url.pathname)) return null;
    return url.href;
  } catch { return null; }
}
export function inspectHtml(html, url) {
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map(m => attrs(m[0]));
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map(m => attrs(m[0]));
  const titles = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map(m => decode(m[1]).trim());
  const descriptions = metas.filter(m => m.name?.toLowerCase() === "description").map(m => m.content ?? "");
  const canonicals = links.filter(l => l.rel?.toLowerCase() === "canonical").map(l => l.href);
  const issues = [];
  if (titles.length !== 1 || !titles[0]) issues.push("Expected one nonempty title");
  if (descriptions.length !== 1 || !descriptions[0].trim()) issues.push("Expected one nonempty meta description");
  if (canonicals.length !== 1 || !canonicals[0]) issues.push("Expected one canonical");
  else if (new URL(canonicals[0], url).href !== url) issues.push(`Canonical differs: ${canonicals[0]}`);
  if ((html.match(/<h1\b/gi) ?? []).length !== 1) issues.push("Expected one H1");
  if (metas.some(m => m.name?.toLowerCase() === "robots" && /noindex/i.test(m.content ?? ""))) issues.push("Page has noindex");
  const anchors = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)].map(m => {
    const a = attrs(m[0].split(">")[0]);
    return { url: a.href ? internalUrl(a.href, url) : null, label: decode(m[0].replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim() };
  }).filter(a => a.url && a.url !== url);
  for (const a of anchors) if (/^(read more|click here|here|learn more)$/i.test(a.label)) issues.push(`Generic anchor: ${a.label} → ${a.url}`);
  for (const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(m[1]); } catch { issues.push("Invalid JSON-LD"); }
  }
  return { title: titles[0], description: descriptions[0], canonical: canonicals[0], links: anchors, issues };
}
async function get(url, fetcher) {
  // Restrict every redirect hop too; never send crawler requests to other origins.
  for (let hop = 0; hop < 6; hop++) {
    const response = await fetcher(url, { redirect: "manual", signal: AbortSignal.timeout(30000), headers: { "user-agent": "BaliAccountingWeeklySEO/1.0" } });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      const next = location && internalUrl(location, url);
      if (!next) throw new Error("Redirect left the approved public origin or route set");
      url = next; continue;
    }
    const body = await response.text();
    if (body.length > 5_000_000) throw new Error("Response exceeded audit size limit");
    return { response, body, finalUrl: url };
  }
  throw new Error("Too many redirects");
}
export async function audit(fetcher = fetch) {
  const targets = new Set([`${ORIGIN}/`, `${ORIGIN}/blog`]);
  const failures = [], pages = [], sitemaps = [];
  const xmlQueue = ["/sitemap.xml", "/sitemap-pages.xml", "/sitemap-journal.xml"].map(p => ORIGIN + p);
  for (const url of xmlQueue) {
    if (sitemaps.includes(url)) continue;
    if (sitemaps.length >= 20) { failures.push("Sitemap inventory exceeded 20 files"); break; }
    sitemaps.push(url);
    try {
      const { response, body } = await get(url, fetcher);
      if (!response.ok || !/<(?:urlset|sitemapindex)\b/i.test(body)) throw new Error(`Not valid sitemap XML (HTTP ${response.status})`);
      for (const match of body.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)) {
        const loc = internalUrl(match[1]);
        if (!loc) { failures.push(`${url}: off-origin/invalid loc`); continue; }
        if (/<sitemapindex\b/i.test(body)) xmlQueue.push(loc); else targets.add(loc);
      }
    } catch (error) { failures.push(`${url}: ${error.message}`); }
  }
  if (targets.size > MAX_PAGES) failures.push(`Inventory exceeds ${MAX_PAGES}-page safety limit; audit incomplete`);
  for (const url of targets) {
    if (pages.length >= MAX_PAGES) break;
    try {
      const { response, body, finalUrl } = await get(url, fetcher);
      const html = response.headers.get("content-type")?.includes("text/html");
      const page = html ? inspectHtml(body, finalUrl) : { issues: ["Expected text/html"], links: [] };
      if (!response.ok) page.issues.push(`HTTP ${response.status}`);
      if (finalUrl !== url) page.issues.push(`Redirects to ${finalUrl}`);
      if (/noindex/i.test(response.headers.get("x-robots-tag") ?? "")) page.issues.push("Response header has noindex");
      pages.push({ url, status: response.status, ...page });
      for (const link of page.links) {
        const path = new URL(link.url).pathname;
        if (!/\.[a-z0-9]{2,8}$/i.test(path)) targets.add(link.url);
      }
    } catch (error) { failures.push(`${url}: ${error.message}`); pages.push({ url, issues: ["Fetch failed; content unverified"], links: [] }); }
  }
  for (const field of ["title", "description"]) {
    const seen = new Map();
    for (const page of pages) {
      if (!page[field]) continue;
      if (seen.has(page[field])) page.issues.push(`Duplicate ${field} with ${seen.get(page[field])}`);
      else seen.set(page[field], page.url);
    }
  }
  const reached = new Set([`${ORIGIN}/`]);
  for (let changed = true; changed;) {
    changed = false;
    for (const page of pages) if (reached.has(page.url)) for (const link of page.links) {
      if (!reached.has(link.url)) { reached.add(link.url); changed = true; }
    }
  }
  const inbound = new Map();
  for (const page of pages) for (const link of page.links) {
    if (!inbound.has(link.url)) inbound.set(link.url, new Set());
    inbound.get(link.url).add(page.url);
  }
  for (const page of pages) {
    page.inboundPages = inbound.get(page.url)?.size ?? 0;
    if (!reached.has(page.url)) page.issues.push("Not reachable from homepage within inspected graph");
  }
  return { checkedAt: new Date().toISOString(), origin: ORIGIN, incomplete: failures.length > 0 || targets.size > pages.length, failures, pages,
    analytics: { status: "unavailable", reason: "No recurring authenticated analytics connection configured. Crawl counts are not traffic, rankings or conversions." },
    policy: "Read-only audit. No automatic editorial rewrites, merges, or ranking promises. Existing external editorial schedule is unchanged." };
}
async function main() {
  const out = process.argv[2] ?? ".cache/weekly-seo";
  const report = await audit();
  mkdirSync(out, { recursive: true });
  writeFileSync(`${out}/audit.json`, JSON.stringify(report, null, 2) + "\n");
  const count = report.pages.filter(p => p.issues.length).length;
  writeFileSync(`${out}/summary.md`, `# Weekly SEO audit\n\n${report.checkedAt}\n\nInspected ${report.pages.length} pages; ${count} pages have findings. Inventory ${report.incomplete ? "INCOMPLETE" : "completed within limits"}.\n\nAnalytics: unavailable; not a statement of zero traffic. No automatic content changes or releases.\n\n${report.failures.map(f => `- ${f}`).join("\n")}\n\n${report.pages.filter(p => p.issues.length).map(p => `## ${p.url}\n${p.issues.map(i => `- ${i}`).join("\n")}`).join("\n\n")}\n`);
  console.log(`Inspected ${report.pages.length} pages; ${count} with findings; complete=${!report.incomplete}. Analytics unavailable.`);
  if (report.incomplete || count) process.exitCode = 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch(error => { console.error(error.message); process.exitCode = 1; });
