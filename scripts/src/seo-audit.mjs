#!/usr/bin/env node
/**
 * Metadata and link audit for the prerendered build.
 *
 * The built HTML is the release artefact, so the contract is checked there, not
 * in the source. Every marketing route must ship: one title, one description,
 * one canonical, one H1, complete Open Graph and Twitter tags, parseable
 * JSON-LD, a breadcrumb, and a noindex decision that matches the route registry.
 * Duplicate titles or descriptions across routes fail the build, and internal
 * links must resolve to a file this build actually wrote.
 *
 * Writes docs/seo/meta-audit.json (a tracked snapshot, so metadata changes show
 * up in review) and exits non-zero on any error.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = process.env.SEO_REPO_ROOT ? path.resolve(process.env.SEO_REPO_ROOT) : path.resolve(here, "../..");
const appRoot = path.join(repoRoot, "artifacts/villabooks-bali");
const dist = path.join(appRoot, "dist/public");
const ORIGIN = "https://bali-villa-accounting-service.com";
const titleRange = [15, 65];
const descRange = [70, 165];

if (!existsSync(dist)) {
  console.error(`seo-audit: no build at ${dist}. Run the build first.`);
  process.exit(1);
}

const routes = JSON.parse(readFileSync(path.join(dist, "routes.json"), "utf8"));
const journalPaths = existsSync(path.join(dist, "journal-static.json"))
  ? JSON.parse(readFileSync(path.join(dist, "journal-static.json"), "utf8"))
  : [];
// /blog is served by the journal origin at runtime, not by this build.
const pagePaths = [...routes, ...journalPaths];

const errors = [];
const warnings = [];
const pages = [];

const decode = value => value
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'");

const text = html => decode(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());

function fileFor(route) {
  return route === "/" ? path.join(dist, "index.html") : path.join(dist, route.slice(1), "index.html");
}

function meta(html, attr, key) {
  const match = html.match(new RegExp(`<meta[^>]+${attr}=["']${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*>`, "i"));
  if (!match) return null;
  const content = match[0].match(/content=["']([^"']*)["']/i);
  return content ? decode(content[1]) : null;
}

const seenTitles = new Map();
const seenDescriptions = new Map();

for (const route of pagePaths) {
  const file = fileFor(route);
  const record = { path: route, issues: [], warnings: [] };
  if (!existsSync(file)) {
    errors.push(`${route}: no prerendered document at ${path.relative(repoRoot, file)}`);
    record.issues.push("missing document");
    pages.push(record);
    continue;
  }
  const html = readFileSync(file, "utf8");

  const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [, ""])[1].trim();
  if (!title) record.issues.push("missing title");
  else {
    record.title = decode(title);
    if (title.length < titleRange[0] || title.length > titleRange[1])
      record.warnings.push(`title length ${title.length} outside ${titleRange[0]}–${titleRange[1]}`);
    const prior = seenTitles.get(title);
    if (prior) record.issues.push(`duplicate title with ${prior}`);
    else seenTitles.set(title, route);
  }

  const description = meta(html, "name", "description");
  if (!description) record.issues.push("missing meta description");
  else {
    record.description = description;
    if (description.length < descRange[0] || description.length > descRange[1])
      record.warnings.push(`description length ${description.length} outside ${descRange[0]}–${descRange[1]}`);
    const prior = seenDescriptions.get(description);
    if (prior) record.issues.push(`duplicate description with ${prior}`);
    else seenDescriptions.set(description, route);
  }

  const canonicals = [...html.matchAll(/<link[^>]+rel=["']canonical["'][^>]*>/gi)];
  if (canonicals.length !== 1) record.issues.push(`${canonicals.length} canonical tags`);
  else {
    const href = (canonicals[0][0].match(/href=["']([^"']*)["']/i) || [, ""])[1];
    record.canonical = href;
    const expected = `${ORIGIN}${route === "/" ? "/" : route}`;
    if (href !== expected) record.issues.push(`canonical ${href} !== ${expected}`);
  }

  const robots = meta(html, "name", "robots") ?? "";
  record.robots = robots || "index,follow";
  if (/noindex/i.test(robots)) record.issues.push("noindex on a routable page");

  const h1s = [...html.matchAll(/<h1[\s>]/gi)].length;
  if (h1s !== 1) record.issues.push(`${h1s} h1 elements`);

  for (const [attr, key] of [["property", "og:title"], ["property", "og:description"], ["property", "og:url"], ["property", "og:image"], ["name", "twitter:card"], ["name", "twitter:image"]]) {
    if (!meta(html, attr, key)) record.issues.push(`missing ${key}`);
  }
  const ogImage = meta(html, "property", "og:image");
  if (ogImage) {
    record.ogImage = ogImage;
    if (!ogImage.startsWith(ORIGIN + "/")) record.issues.push("og:image is not on the canonical origin");
    else {
      const asset = path.join(dist, ogImage.slice(ORIGIN.length + 1));
      if (!existsSync(asset)) record.issues.push(`og:image file missing: ${ogImage.slice(ORIGIN.length)}`);
    }
  }

  const ld = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  const types = [];
  for (const block of ld) {
    try {
      const parsed = JSON.parse(decode(block));
      const graph = parsed["@graph"] ?? [parsed];
      for (const node of graph) if (node && node["@type"]) types.push(node["@type"]);
    } catch { record.issues.push("JSON-LD does not parse"); }
  }
  record.schemaTypes = [...new Set(types)];
  if (!record.schemaTypes.length) record.issues.push("no JSON-LD");
  if (route !== "/" && !record.schemaTypes.includes("BreadcrumbList")) record.issues.push("no BreadcrumbList");

  const body = html.split('<div id="root">')[1] ?? "";
  const words = text(body).split(" ").filter(Boolean).length;
  record.words = words;
  if (words < 300) record.issues.push(`thin body: ${words} words`);
  else if (words < 600) record.warnings.push(`short body: ${words} words`);

  // FAQ visible-text check. Accordions (<details>) are one way of rendering an FAQ,
  // headings plus body copy are the other, so read the question text itself from the schema
  // and match it against what a reader (and a crawler) actually sees.
  const details = (html.match(/<details[\s>]/gi) || []).length;
  const ent = v => v
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
  const visible = ent(text(html)).toLowerCase().replace(/[\u2018\u2019]/g, "'");
  const faqQuestions = [];
  for (const block of ld) {
    try {
      const parsed = JSON.parse(decode(block));
      const graph = parsed["@graph"] ?? [parsed];
      for (const node of graph) {
        if (!node || node["@type"] !== "FAQPage") continue;
        for (const item of node.mainEntity ?? []) {
          const q = item?.name;
          if (typeof q === "string") faqQuestions.push(q);
        }
      }
    } catch {}
  }
  record.faqQuestions = faqQuestions.length;
  if (details && !record.schemaTypes.includes("FAQPage")) record.warnings.push(`${details} FAQ blocks without FAQPage schema`);
  if (record.schemaTypes.includes("FAQPage")) {
    const missing = faqQuestions.filter(q => {
      const norm = ent(q).toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[?.!]+$/, "").replace(/\s+/g, " ").trim();
      return norm.length > 0 && !visible.includes(norm);
    });
    if (!faqQuestions.length) record.warnings.push("FAQPage schema with no readable questions");
    // 2026-10-31: was a warning, so it detected the defect and still exited 0 (QA #3 item 2).
    // A schema question a reader cannot see is a markup defect, so it now fails the build.
    else if (missing.length) record.issues.push(`${missing.length}/${faqQuestions.length} schema FAQs not found in visible text: ${missing[0].slice(0, 60)}`);
  }

  pages.push(record);
}

// Internal link resolution against what this build actually wrote.
const builtTargets = new Set();
function walk(dir, prefix = "") {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const route = `${prefix}/${entry}`;
    if (statSync(full).isDirectory()) walk(full, route);
    else {
      builtTargets.add(route);
      if (entry === "index.html") builtTargets.add(route.slice(0, -"/index.html".length) || "/");
    }
  }
}
walk(dist);

const runtimePrefixes = ["/api/", "/blog", "/sitemap"];
const external = [];
const internalLinks = new Map();
for (const record of pages) {
  const file = fileFor(record.path);
  if (!existsSync(file)) continue;
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = decode(match[1]);
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    if (href.startsWith("#")) continue;
    const clean = href.split("#")[0].split("?")[0].replace(/\/$/, "") || "/";
    if (!internalLinks.has(clean)) internalLinks.set(clean, new Set());
    internalLinks.get(clean).add(record.path);
  }
}
for (const [target, sources] of internalLinks) {
  if (builtTargets.has(target) || builtTargets.has(`${target}/index.html`)) continue;
  if (builtTargets.has(target) || [...builtTargets].some(file => file.startsWith(`${target}.`))) continue;
  if (runtimePrefixes.some(prefix => target.startsWith(prefix))) continue;
  if (/^\/(images|assets)\//.test(target)) {
    errors.push(`link to missing asset ${target} (from ${[...sources].slice(0, 3).join(", ")})`);
    continue;
  }
  external.push({ target, sources: [...sources].slice(0, 5) });
}

// 2026-10-31: the loop above reads href= only, so a <script src> or <img src> that 404s
// passed the gate. Also check that no document was baked with a bundle this build does not
// ship: that is the shape of the journal defect (77 URLs pointing at a dead asset pair).
const rootAssets = new Set(
  [...readFileSync(path.join(dist, "index.html"), "utf8").matchAll(/\/assets\/[A-Za-z0-9._-]+/g)].map(match => match[0]),
);
for (const record of pages) {
  const file = fileFor(record.path);
  if (!existsSync(file)) continue;
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(/src="(\/(?:assets|images)\/[^"?]+)/g)) {
    const target = decode(match[1]);
    if (!existsSync(path.join(dist, target.slice(1)))) errors.push(`${record.path}: missing asset ${target}`);
  }
  for (const match of html.matchAll(/\/assets\/[A-Za-z0-9._-]+/g)) {
    if (!rootAssets.has(match[0])) errors.push(`${record.path}: references ${match[0]}, which this build does not ship`);
  }
}

for (const record of pages) if (record.issues.length) errors.push(`${record.path}: ${record.issues.join("; ")}`);
for (const record of pages) if (record.warnings.length) warnings.push(`${record.path}: ${record.warnings.join("; ")}`);
for (const dead of external) errors.push(`unresolved internal link ${dead.target} (from ${dead.sources.join(", ")})`);

const sitemapFiles = readdirSync(dist).filter(name => name.startsWith("sitemap"));
for (const sitemap of sitemapFiles) {
  const body = readFileSync(path.join(dist, sitemap), "utf8");
  for (const match of body.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const url = match[1];
    if (!url.startsWith(ORIGIN)) errors.push(`${sitemap}: off-origin URL ${url}`);
  }
}
const robots = readFileSync(path.join(dist, "robots.txt"), "utf8");
for (const sitemap of sitemapFiles) if (!robots.includes(`/${sitemap}`)) warnings.push(`robots.txt does not reference ${sitemap}`);
const routableNotInSitemap = routes.filter(route => {
  const p = path.join(dist, `sitemap-pages.xml`);
  return existsSync(p) && !readFileSync(p, "utf8").includes(`${ORIGIN}${route}<`) && route !== "/";
});
if (routableNotInSitemap.length) errors.push(`routes missing from sitemap-pages.xml: ${routableNotInSitemap.join(", ")}`);

const report = {
  generatedAt: new Date().toISOString(),
  origin: ORIGIN,
  pages: pages.length,
  errors,
  warnings,
  routes: pages,
};
const outFile = path.join(repoRoot, "docs/seo/meta-audit.json");
mkdirSync(path.dirname(outFile), { recursive: true });
writeFileSync(outFile, `${JSON.stringify(report, null, 2)}\n`);

const label = errors.length ? "FAIL" : warnings.length ? "PASS with warnings" : "PASS";
console.log(`seo-audit: ${label} — ${pages.length} documents, ${errors.length} errors, ${warnings.length} warnings`);
for (const issue of errors) console.log(`  ERROR ${issue}`);
for (const issue of warnings.slice(0, 25)) console.log(`  WARN  ${issue}`);
if (warnings.length > 25) console.log(`  WARN  … ${warnings.length - 25} more in docs/seo/meta-audit.json`);
process.exit(errors.length ? 1 : 0);
