/**
 * Pre-render script — runs after vite build to inject static HTML into index.html.
 * If it fails for any reason, the build still succeeds (SPA fallback is served).
 */
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "dist/public");
const serverDir = path.join(__dirname, "dist/server");

try {
  const { render } = await import(path.join(serverDir, "entry-server.js"));
  const template = readFileSync(path.join(publicDir, "index.html"), "utf-8");
  const appHtml = render();
  const html = template.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`
  );
  writeFileSync(path.join(publicDir, "index.html"), html);
  console.log("✓ Pre-rendered index.html — Googlebot can now read all content");
} catch (err) {
  console.warn("⚠ Pre-render step failed (non-fatal):", err.message);
  console.warn("  Serving client-only SPA as fallback.");
} finally {
  try {
    rmSync(serverDir, { recursive: true, force: true });
  } catch {}
}
