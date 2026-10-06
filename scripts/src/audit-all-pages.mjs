import { mkdir, readFile, writeFile } from "node:fs/promises";
const [origin, phase = "after"] = process.argv.slice(2);
if (!origin) throw new Error("Provide the app origin");
const response = await fetch(`${origin}/api/blog/posts?limit=50`);
if (!response.ok) throw new Error(`Cannot inventory journal: ${response.status}`);
const posts = await response.json();
const routes = ["/", "/services", "/airbnb-bookkeeping-bali", "/villa-financial-reporting-bali", "/villa-bookkeeping-cleanup-bali", "/pt-pma-villa-bookkeeping", "/villa-payroll-records-bali", "/pricing", "/sample-report", "/about", "/get-started", "/faq", "/privacy", "/terms", "/blog", ...posts.map(p => `/blog/${p.slug}`)];
const pages = [];
for (let i = 0; i < routes.length; i += 4) {
  pages.push(...await Promise.all(routes.slice(i, i + 4).map(async route => {
    const res = await fetch(`${origin}${route}`, { signal: AbortSignal.timeout(45000) });
    const html = await res.text();
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
    const text = main.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, "").replace(/<[^>]*>/g, " ").replace(/&[^;\s]+;/g, " ");
    const meta = name => html.match(new RegExp(`<meta[^>]+name="${name}"[^>]+content="([^"]*)"`,"i"))?.[1];
    const schema = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map(m => JSON.parse(m[1]));
    return { route, status: res.status, title: html.match(/<title>([\s\S]*?)<\/title>/i)?.[1], description: meta("description"), h1Count: (main.match(/<h1\b/gi) ?? []).length, words: (text.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? []).length, canonical: html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i)?.[1], headings: [...main.matchAll(/<h[12]\b[^>]*>([\s\S]*?)<\/h[12]>/gi)].map(m=>m[1].replace(/<[^>]*>/g,"")), internalLinks: [...main.matchAll(/<a[^>]+href="(\/[^"]*)"/gi)].map(m=>m[1]), schemaBlocks: schema.length };
  })));
}
const duplicates = field => pages.filter((p,i) => pages.findIndex(q => q[field] === p[field]) !== i).map(p => p.route);
const report = { checkedAt: new Date().toISOString(), pageCount: pages.length, duplicateTitles: duplicates("title"), duplicateDescriptions: duplicates("description"), pages };
await mkdir("docs/seo-research", { recursive: true });
await writeFile(`docs/seo-research/site-audit-${phase}.json`, JSON.stringify(report, null, 2));
if (phase === "after") {
  const baseline = JSON.parse(await readFile("docs/seo-research/site-audit-before.json", "utf8"));
  const improvements = pages.map(page => {
    const before = baseline.pages.find(p => p.route === page.route);
    return { route: page.route, beforeWords: before?.words ?? 0, afterWords: page.words, addedWords: page.words - (before?.words ?? 0), title: page.title, description: page.description };
  });
  const csv = value => `"${String(value).replaceAll('"', '""')}"`;
  const columns = ["route", "beforeWords", "afterWords", "addedWords", "title", "description"];
  await writeFile("docs/seo-research/page-improvements.csv", [columns.join(","), ...improvements.map(row=>columns.map(key=>csv(row[key])).join(","))].join("\n"));
  if (improvements.some(p => p.addedWords <= 0)) throw new Error("Some pages have no added content; inspect page-improvements.csv");
  console.log(`All ${improvements.length} pages gained content; ${improvements.reduce((sum,p)=>sum+p.addedWords,0)} additional initial-HTML words.`);
}
for (const p of pages) console.log(`${p.status} | ${p.words} words | ${p.h1Count} H1 | ${p.route}`);
if (pages.some(p => p.status !== 200 || p.h1Count !== 1 || !p.title || !p.description || !p.canonical || p.schemaBlocks === 0) || report.duplicateTitles.length || report.duplicateDescriptions.length) throw new Error("Site-wide audit failed; inspect report");
