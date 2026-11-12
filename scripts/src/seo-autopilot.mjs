#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

export const root = fileURLToPath(new URL("../../", import.meta.url));
const read = name => JSON.parse(readFileSync(path.join(root, name), "utf8"));
export const normalizeKeyword = value => value.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
export const textOnly = html => html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&[^; ]+;/g, " ").replace(/\s+/g, " ").trim();

export function validateLocks(lock, previous) {
  const errors = [], owners = new Map();
  for (const [url, item] of Object.entries(lock.pages ?? {})) {
    if (!/^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/.test(url)) errors.push(`Invalid canonical path: ${url}`);
    const keyword = normalizeKeyword(item.primary ?? "");
    if (!keyword) errors.push(`Missing primary keyword: ${url}`);
    if (owners.has(keyword)) errors.push(`Keyword collision: ${url} and ${owners.get(keyword)} own ${keyword}`);
    owners.set(keyword, url);
    if (item.serviceOwner && !lock.pages[item.serviceOwner]) errors.push(`Unknown service owner: ${url}`);
  }
  for (const [url, item] of Object.entries(previous?.pages ?? {})) {
    if (!lock.pages[url] || normalizeKeyword(lock.pages[url].primary) !== normalizeKeyword(item.primary))
      errors.push(`Locked keyword changed or removed: ${url}`);
    if (lock.pages[url]?.kind !== item.kind) errors.push(`Locked page kind changed: ${url}`);
  }
  return errors;
}

export function validateArticles(posts, lock, config) {
  const errors = [], slugs = new Set(), titles = new Set();
  const allowed = new Set([...Object.keys(lock.pages), "/blog"]);
  for (const post of posts) {
    const url = `/blog/${post.slug}`;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug) || slugs.has(post.slug)) errors.push(`Invalid or duplicate slug: ${post.slug}`);
    slugs.add(post.slug);
    if (titles.has(normalizeKeyword(post.title))) errors.push(`Duplicate title: ${post.title}`);
    titles.add(normalizeKeyword(post.title));
    const owner = lock.pages[url];
    if (owner?.kind !== "article" || normalizeKeyword(owner.primary) !== normalizeKeyword(post.primaryKeyword)) errors.push(`Article does not match its keyword lock: ${url}`);
    const words = textOnly(post.contentHtml).split(" ").filter(Boolean).length;
    if (words < config.minimumArticleWords || words > config.maximumArticleWords) errors.push(`Article length ${words}: ${url}`);
    if (post.wordCount !== words) errors.push(`Incorrect wordCount: ${url}`);
    if (!post.metaTitle || post.metaTitle.length > 65 || !post.metaDescription || post.metaDescription.length < 70 || post.metaDescription.length > 165) errors.push(`Invalid metadata: ${url}`);
    if (/<\/?h1\b|<script\b|\son\w+\s*=|javascript:/i.test(post.contentHtml)) errors.push(`Unsafe markup or extra H1: ${url}`);
    const headings = [...post.contentHtml.matchAll(/<h2\b/g)].length;
    if (headings < 5 || !post.contentHtml.includes("<table") || !/illustrative/i.test(post.contentHtml)) errors.push(`Missing useful structure/example: ${url}`);
    if (post.faqs?.length < 4 || post.faqs?.length > 6) errors.push(`Expected 4-6 FAQs: ${url}`);
    for (const [question, answer] of post.faqs ?? []) {
      if (!textOnly(post.contentHtml).includes(question) || !textOnly(post.contentHtml).includes(answer)) errors.push(`FAQ not visible: ${url}: ${question}`);
    }
    const links = [...post.contentHtml.matchAll(/href="([^"]+)"/g)].map(m => m[1].split("#")[0]);
    for (const target of [owner?.serviceOwner, "/pricing", "/get-started"]) if (!links.includes(target)) errors.push(`Missing conversion/service link ${target}: ${url}`);
    if (links.filter(href => href.startsWith("/blog/")).length < 2) errors.push(`Expected two related guides: ${url}`);
    for (const href of links) if (href.startsWith("/") && !allowed.has(href)) errors.push(`Unknown internal link ${href}: ${url}`);
    if (!links.some(href => /^https:\/\/wa.me\/6281237402292/.test(href))) errors.push(`Missing approved WhatsApp link: ${url}`);
    if (!post.imageUrl?.startsWith("/images/") || !existsSync(path.join(root, "artifacts/villabooks-bali/public", post.imageUrl))) errors.push(`Missing local cover: ${url}`);
    if (!post.imageAlt || !post.publishedAt || !post.updatedAt || !Number.isFinite(Date.parse(post.publishedAt)) || !Number.isFinite(Date.parse(post.updatedAt))) errors.push(`Missing image/date metadata: ${url}`);
  }
  return errors;
}

export async function inventory(fetcher = fetch) {
  const origin = read("seo-autopilot.json").site;
  const posts = [], seen = new Set();
  for (let offset = 0; offset < 10000; offset += 50) {
    const response = await fetcher(`${origin}/api/blog/posts?limit=50&offset=${offset}`, { signal: AbortSignal.timeout(30000) });
    if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) throw new Error(`Journal inventory failed at offset ${offset}: ${response.status}`);
    const body = await response.json(), batch = Array.isArray(body) ? body : body.posts;
    if (!Array.isArray(batch)) throw new Error("Unexpected journal inventory response");
    for (const post of batch) {
      if (seen.has(post.slug)) throw new Error(`Repeated journal slug: ${post.slug}. Check pagination.`);
      seen.add(post.slug); posts.push(post);
    }
    if (batch.length < 50) return posts;
  }
  throw new Error("Journal inventory did not terminate");
}

async function main() {
  const [mode = "check", ...args] = process.argv.slice(2);
  const config = read("seo-autopilot.json"), lock = read(config.keywordLock), posts = read(config.articles);
  if (mode === "check") {
    let previous;
    if (args[0] === "--base-ref" && args[1]) {
      let exists = false;
      try { execFileSync("git", ["cat-file", "-e", `${args[1]}:${config.keywordLock}`], { cwd: root, stdio: "ignore" }); exists = true; } catch {}
      if (exists) previous = JSON.parse(execFileSync("git", ["show", `${args[1]}:${config.keywordLock}`], { cwd: root, encoding: "utf8" }));
      else {
        // Only the installation commit may introduce the lock for the first time.
        execFileSync("git", ["rev-parse", "--verify", args[1]], { cwd: root, stdio: "ignore" });
      }
    } else if (args.length) throw new Error("Usage: check [--base-ref COMMIT]");
    const errors = [...validateLocks(lock, previous), ...validateArticles(posts, lock, config)];
    if (errors.length) throw new Error(errors.join("\n"));
    console.log(`PASS: ${Object.keys(lock.pages).length} unique keyword owners; ${posts.length} autopilot articles validated${previous ? "; existing keyword assignments preserved" : ""}.`);
  } else if (mode === "plan") {
    const live = await inventory();
    const snapshot = { checkedAt: new Date().toISOString(), livePosts: live, staticPosts: posts.map(({contentHtml, ...p}) => p),
      unmapped: live.filter(p => !lock.pages[`/blog/${p.slug}`]).map(p => p.slug),
      measurements: { searchConsole: "unavailable unless separately connected", ga4: "unavailable unless separately connected", keywordVolumes: "not refreshed by this crawl" } };
    mkdirSync(path.join(root, ".cache"), { recursive: true });
    writeFileSync(path.join(root, ".cache/seo-autopilot-inventory.json"), JSON.stringify(snapshot, null, 2) + "\n");
    console.log(`Read ${live.length} live database articles and ${posts.length} repository articles. Inventory: .cache/seo-autopilot-inventory.json. Unmapped: ${snapshot.unmapped.length}.`);
  } else if (mode === "verify-live") {
    const paths = args.length ? args : ["/", "/services", "/pricing", "/sitemap-journal.xml", "/sitemap-pages.xml", ...posts.map(p => `/blog/${p.slug}`)];
    for (const route of paths) {
      if (!/^\/[a-z0-9/_.-]*$/.test(route)) throw new Error("Verification requires an internal path");
      const response = await fetch(`${config.site}${route}`, { signal: AbortSignal.timeout(30000) });
      const html = await response.text(), post = posts.find(p => route === `/blog/${p.slug}`);
      if (!response.ok) throw new Error(`${route}: HTTP ${response.status}`);
      if (route.endsWith(".xml")) {
        if (!response.headers.get("content-type")?.includes("xml") || !html.includes("<urlset")) throw new Error(`Not a sitemap: ${route}`);
        if (route === "/sitemap-journal.xml") for (const p of posts) if (!html.includes(`/blog/${p.slug}</loc>`)) throw new Error(`Sitemap missing ${p.slug}`);
      } else {
        if (!response.headers.get("content-type")?.includes("text/html") || !html.includes("<h1")) throw new Error(`Not a public page: ${route}`);
        if (post && (!html.includes(post.slug) || !html.includes(post.title) || !html.includes('"static":true'))) throw new Error(`Expected article revision not live: ${route}`);
      }
      console.log(`PASS live: ${route}`);
    }
  } else throw new Error("Use check, plan, or verify-live");
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1; });
