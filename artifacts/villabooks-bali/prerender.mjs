/** Every marketing route is real initial HTML. Rendering failures fail the release. */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, "dist/public");
const server = path.join(root, "dist/server");
const { render, pageDocument, sitePages } = await import(path.join(server, "entry-server.js"));
const template = readFileSync(path.join(output, "index.html"), "utf8");
const pages = Object.keys(sitePages);
const imagery = JSON.parse(readFileSync(path.join(root, "../../lib/site-content/src/page-imagery.json"), "utf8"));
if (JSON.stringify([...pages, "/blog"].sort()) !== JSON.stringify(Object.keys(imagery).sort()))
  throw new Error("Canonical page routes and the imagery/sitemap inventory have drifted.");
for (const [pathname, visual] of Object.entries(imagery)) {
  for (const asset of [visual.imageUrl, visual.shareImage]) {
    if (!asset.startsWith("/images/") || !readFileSync(path.join(output, asset.slice(1))).length)
      throw new Error(`Missing image for ${pathname}: ${asset}`);
  }
}
for (const pathname of [...pages, "/404"]) {
  const target = pathname === "/" ? path.join(output, "index.html") : path.join(output, pathname.slice(1), "index.html");
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, pageDocument(template, render(pathname), pathname));
}
writeFileSync(path.join(output, "routes.json"), JSON.stringify(pages));
// Vercel serves this document with a real 404 instead of a homepage fallback.
writeFileSync(path.join(output, "404.html"), pageDocument(template, render("/404"), "/404"));
writeFileSync(path.join(output, "robots.txt"), "User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: https://bali-villa-accounting-service.com/sitemap.xml\n");
rmSync(server, { recursive: true, force: true });
process.stdout.write(`Pre-rendered ${pages.length} distinct marketing pages and a real 404 document.\n`);
