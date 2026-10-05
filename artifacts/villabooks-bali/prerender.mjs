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
for (const pathname of [...pages, "/404"]) {
  const target = pathname === "/" ? path.join(output, "index.html") : path.join(output, pathname.slice(1), "index.html");
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, pageDocument(template, render(pathname), pathname));
}
writeFileSync(path.join(output, "routes.json"), JSON.stringify(pages));
writeFileSync(path.join(output, "robots.txt"), "User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: https://bali-villa-accounting-service.com/sitemap.xml\n");
rmSync(server, { recursive: true, force: true });
process.stdout.write(`Pre-rendered ${pages.length} distinct marketing pages and a real 404 document.\n`);
