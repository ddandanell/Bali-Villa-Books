import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const publicDir = path.join(root, "artifacts/villabooks-bali/public");
const pages = JSON.parse(readFileSync(path.join(root, "lib/site-content/src/page-imagery.json"), "utf8"));
const journals = JSON.parse(readFileSync(path.join(root, "lib/site-content/src/journal-imagery.json"), "utf8"));
const escape = s => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]));
const words = (s, limit = 32) => {
  const lines = []; let line = "";
  for (const word of s.split(/\s+/)) {
    if ((line + " " + word).trim().length > limit && line) { lines.push(line); line = word; }
    else line = (line + " " + word).trim();
  }
  if (line) lines.push(line);
  return lines.slice(0, 5);
};
const titleFor = (route, slug) => {
  if (route === "/blog") return "The Bali Accounting Journal";
  const file = path.join(root, "artifacts/villabooks-bali/dist/public", route === "/" ? "index.html" : `${slug}/index.html`);
  if (existsSync(file)) {
    const match = readFileSync(file, "utf8").match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/);
    if (match) return match[1].replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/<!--.*?-->/g, "");
  }
  return slug.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
};
const published = await fetch("https://bali-villa-accounting-service.com/api/blog/posts?limit=50");
if (!published.ok) throw new Error("Cannot read public journal titles");
const articleTitles = new Map((await published.json()).map(p => [p.slug, p.title]));
const refreshFile = path.join(root, "artifacts/api-server/src/data/seo-refresh-2026-10.json");
if (existsSync(refreshFile)) for (const post of JSON.parse(readFileSync(refreshFile, "utf8"))) articleTitles.set(post.slug, post.title);
const temp = path.join(root, ".local/site-imagery");
mkdirSync(temp, { recursive: true });
let count = 0;
for (const [kind, inventory] of [["pages", pages], ["journal", journals]]) {
  for (const [key, visual] of Object.entries(inventory)) {
    const slug = kind === "journal" ? key : key === "/" ? "home" : key === "/blog" ? "journal" : key.slice(1);
    const destination = path.join(publicDir, visual.imageUrl.slice(1));
    mkdirSync(path.dirname(destination), { recursive: true });
    if (key !== "/") {
      const source = path.join(root, `attached_assets/generated_images/${kind}-${slug}-2026-10.jpg`);
      if (!existsSync(source)) throw new Error(`Missing generated source: ${slug}`);
      execFileSync("magick", [source, "-auto-orient", "-resize", "1200x750^", "-gravity", "center", "-extent", "1200x750", "-strip", "-quality", "82", destination]);
    }
    const title = kind === "journal" ? articleTitles.get(key) ?? titleFor(`/blog/${key}`, key) : titleFor(key, slug);
    const lines = words(title);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <defs><linearGradient id="shade"><stop offset="0" stop-color="#14382f" stop-opacity=".97"/><stop offset=".65" stop-color="#14382f" stop-opacity=".91"/><stop offset="1" stop-color="#14382f" stop-opacity=".08"/></linearGradient></defs>
      <rect width="1200" height="630" fill="url(#shade)"/>
      <text x="58" y="82" fill="#f8f5ee" font-size="36" font-family="DejaVu Serif">Bali Accounting</text>
      <text x="60" y="120" fill="#dda981" font-size="15" letter-spacing="3" font-family="DejaVu Sans">DENPASAR · BALI</text>
      <path d="M60 153h86" stroke="#c88761" stroke-width="3"/>
      ${lines.map((line, index) => `<text x="58" y="${228 + index * 60}" fill="#fffdf6" font-size="47" font-family="DejaVu Serif">${escape(line)}</text>`).join("")}
      <text x="60" y="590" fill="#f8f5ee" font-size="17" font-family="DejaVu Sans">bali-villa-accounting-service.com</text>
    </svg>`;
    const overlay = path.join(temp, "overlay.svg");
    writeFileSync(overlay, svg);
    const share = path.join(publicDir, visual.shareImage.slice(1));
    mkdirSync(path.dirname(share), { recursive: true });
    execFileSync("magick", [destination, "-resize", "1200x630^", "-gravity", "center", "-extent", "1200x630", overlay, "-compose", "over", "-composite", "-strip", "-quality", "84", share]);
    count++;
  }
}
for (const filename of ["opengraph.jpg", "bali-accounting-share-2026-10.jpg"]) copyFileSync(path.join(publicDir, pages["/"].shareImage.slice(1)), path.join(publicDir, filename));
copyFileSync(path.join(publicDir, pages["/blog"].shareImage.slice(1)), path.join(publicDir, "bali-accounting-journal-share-2026-10.jpg"));
console.log(`Prepared ${count} distinct primary images and ${count} matching 1200×630 share cards.`);
