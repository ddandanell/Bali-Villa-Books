import blueprint from "../../../../attached_assets/Pasted--100-Blog-Content-Blueprint-bali-villa-accounting-servi_1791500510826.txt";

export type BlueprintTopic = { id: number; cluster: string; workingTitle: string; keyword: string; service: string };
const services: Record<string, string> = {
  A: "/services", B: "/pt-pma-villa-bookkeeping", C: "/pt-pma-villa-bookkeeping",
  D: "/pt-pma-villa-bookkeeping", E: "/services", F: "/pt-pma-villa-bookkeeping",
  G: "/services", H: "/villa-financial-reporting-bali",
};
const topics: BlueprintTopic[] = [];
let cluster = "";
for (const line of blueprint.split(/\r?\n/)) {
  const section = /^### Cluster ([A-H])\b/.exec(line);
  if (section) cluster = section[1];
  const item = /^(\d+)\. (.*?) \| ([^|]+) \|/.exec(line);
  if (item && cluster) topics.push({
    id: Number(item[1]), cluster, workingTitle: item[2].trim(),
    keyword: item[3].trim(), service: services[cluster],
  });
}
if (topics.length !== 100 || new Set(topics.map(t => t.id)).size !== 100)
  throw new Error("The uploaded blueprint must contain 100 distinct numbered topics");
export const blueprintTopics = topics;

export function nextBlueprintTopic(existing: { primaryKeyword: string }[], requestedId?: number) {
  const covered = new Set(existing.map(p => p.primaryKeyword.toLowerCase()));
  const ordered = requestedId ? topics.filter(t => t.id === requestedId)
    : [...topics].sort((a, b) => "AHBCDEFG".indexOf(a.cluster) - "AHBCDEFG".indexOf(b.cluster) || a.id - b.id);
  return ordered.find(t => !covered.has(t.keyword.toLowerCase()));
}

/** Additional checks for new blueprint articles, not retroactive requirements for old guides. */
export function validateBlueprintStructure(html: string, keyword: string, actualKeyword: string) {
  if (actualKeyword.toLowerCase() !== keyword.toLowerCase()) throw new Error("The assigned blueprint keyword was changed");
  if (!/<table>/.test(html)) throw new Error("Blueprint article needs a document or worked-example table");
  const text = html.replace(/<[^>]*>/g, " ");
  if (!/who (?:this|the guide) (?:applies|is)/i.test(text)) throw new Error("Missing reader-scope section");
  if (!/illustrative|hypothetical/i.test(text) || !/\bIDR\b/.test(text)) throw new Error("Missing clearly illustrative IDR worked example");
  if (!/what owners get wrong|common mistakes/i.test(text)) throw new Error("Missing mistakes and corrections");
  const faqs = articleFaqs(html);
  if (faqs.length < 4 || faqs.length > 6) throw new Error("Blueprint article must have four to six visible FAQ answers");
  if (!/not tax advice/i.test(text)) throw new Error("Missing tax-advice boundary");
  // No unsourced current rates, penalties, thresholds or universal filing deadlines.
  assertNoUnsupportedClaims(text);
}

export function assertNoUnsupportedClaims(text: string) {
  if (/\b(?:tax|VAT|PPh|PHR|PBJT|BPHTB|withholding|penalty)[^.!?]{0,100}\b\d+(?:\.\d+)?\s*(?:%|percent)/i.test(text)
    || /\b\d+(?:\.\d+)?\s*(?:%|percent)\s+(?:[\w-]+\s+){0,5}(?:tax|VAT|withholding|penalty)\b/i.test(text)
    || /\b(?:must|mandatory|required|due)[^.!?]{0,80}\b(?:March 31|April 30|15th|20th|24 hours)\b/i.test(text))
    throw new Error("Tax-rate or mandatory-deadline claim needs professional source review; do not publish automatically");
}

const plain = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
export function articleFaqs(html: string) {
  const section = html.split(/<h2>Frequently asked questions<\/h2>/i)[1]?.split(/<h2>/i)[0] ?? "";
  return [...section.matchAll(/<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)]
    .map(m => ({ question: plain(m[1]), answer: plain(m[2]) }));
}
