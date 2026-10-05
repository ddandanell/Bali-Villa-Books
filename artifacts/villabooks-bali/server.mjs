/** Dependency-free production server for pre-rendered pages, assets and real HTTP errors. */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(root, "dist/public");
const routes = new Set(JSON.parse(await readFile(path.join(publicDir, "routes.json"), "utf8")));
const origin = "https://bali-villa-accounting-service.com";
const aliases = new Set(["www.bali-villa-accounting-service.com", "bali-villa-books.replit.app"]);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff2": "font/woff2", ".pdf": "application/pdf" };
export const publicServer = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", origin);
    const host = String(req.headers["x-forwarded-host"] ?? req.headers.host ?? "").split(",")[0].trim().split(":")[0];
    if (aliases.has(host)) { res.writeHead(308, { Location: `${origin}${url.pathname}${url.search}` }).end(); return; }
    if (!["GET", "HEAD"].includes(req.method ?? "")) { res.writeHead(405, { Allow: "GET, HEAD" }).end(); return; }
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); } catch { res.writeHead(400).end(); return; }
    if (pathname.includes("\0") || pathname.includes("\\") || pathname.split("/").includes("..")) { res.writeHead(400).end(); return; }
    const normalized = pathname.replace(/\/+$/, "") || "/";
    if (normalized.endsWith("/index.html")) {
      const destination = normalized.slice(0, -11) || "/";
      if (routes.has(destination)) { res.writeHead(308, { Location: `${destination}${url.search}` }).end(); return; }
    }
    if (normalized === "/contact") { res.writeHead(308, { Location: `/get-started${url.search}` }).end(); return; }
    if (pathname !== normalized) { res.writeHead(308, { Location: `${normalized}${url.search}` }).end(); return; }
    const known = routes.has(normalized);
    let target = known ? path.join(publicDir, normalized === "/" ? "index.html" : `${normalized.slice(1)}/index.html`) : path.join(publicDir, pathname);
    let status = 200;
    try {
      if (!(await stat(target)).isFile()) throw new Error("Not a public file");
      // /404 is never a successful resource, and internal route manifest is not public.
      if (normalized === "/404" || normalized === "/routes.json") throw new Error("Not a public route");
    } catch { target = path.join(publicDir, "404/index.html"); status = 404; }
    const content = await readFile(target);
    res.writeHead(status, {
      "Content-Type": types[path.extname(target)] ?? "application/octet-stream",
      "Cache-Control": status === 404 ? "no-store" : pathname.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "public, max-age=300",
      "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin",
      ...(status === 404 ? { "X-Robots-Tag": "noindex" } : {}),
    });
    res.end(req.method === "HEAD" ? undefined : content);
  } catch {
    res.writeHead(503, { "Cache-Control": "no-store", "Retry-After": "60" }).end("The website is temporarily unavailable. Please try again.");
  }
});
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  publicServer.listen(Number(process.env.PORT ?? 18253), "0.0.0.0");
}
