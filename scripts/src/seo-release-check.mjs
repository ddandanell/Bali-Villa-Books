import { writeFile, mkdir } from "node:fs/promises";
const origin = process.argv[2];
const label = process.argv[3] ?? "after";
if (!origin) throw new Error("Provide the URL to audit");
const routes = ["/", "/blog", "/services", "/airbnb-bookkeeping-bali", "/villa-financial-reporting-bali", "/villa-bookkeeping-cleanup-bali", "/pt-pma-villa-bookkeeping", "/villa-payroll-records-bali", "/pricing", "/sample-report", "/about", "/get-started", "/faq", "/privacy", "/terms", "/seo-release-nonexistent", "/blog/seo-release-nonexistent"];
const results = [];
for (const route of routes) {
  try {
    const response = await fetch(`${origin}${route}`, { signal: AbortSignal.timeout(25000) });
    const html = await response.text();
    const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)=["']([^"']*)["']/g)].map(match => [match[1], match[2]]));
    const meta = [...html.matchAll(/<meta\b[^>]*>/gi)].map(match => attrs(match[0]));
    const canonical = [...html.matchAll(/<link\b[^>]*>/gi)].map(match => attrs(match[0])).find(tag => tag.rel === "canonical")?.href;
    const links = [...html.matchAll(/<a\b[^>]*>/gi)].map(match => attrs(match[0]).href).filter(Boolean);
    const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(match => match[1].replace(/<[^>]*>/g, "").trim());
    results.push({
      route, status: response.status, title: html.match(/<title>([\s\S]*?)<\/title>/i)?.[1],
      description: meta.find(tag => tag.name === "description")?.content, canonical, h1: headings,
      indexability: meta.find(tag => tag.name === "robots")?.content ?? "index,follow",
      inboundFrom: [], links, initialHtmlBytes: html.length,
      schemaTypes: [...html.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map(match => match[1]),
    });
  } catch (error) { results.push({ route, error: error.message }); }
}
for (const result of results) result.inboundFrom = results.filter(page => page.links?.some(link => link.split("#")[0].replace(/\/+$/, "") === result.route.replace(/\/+$/, ""))).map(page => page.route);
await mkdir("artifacts/villabooks-bali/release", { recursive: true });
await writeFile(`artifacts/villabooks-bali/release/seo-${label}.json`, JSON.stringify(results, null, 2));
for (const result of results) process.stdout.write(`${result.route}: ${result.status ?? result.error} | ${result.h1?.length ?? 0} H1 | ${result.canonical ?? "-"} | inbound ${result.inboundFrom?.length ?? 0}\n`);
if (label === "after" && results.some(result => result.error || (result.route.includes("nonexistent") ? result.status !== 404 : result.status !== 200 || result.h1.length !== 1 || !result.canonical || !result.description || !result.inboundFrom.length))) process.exitCode = 1;
