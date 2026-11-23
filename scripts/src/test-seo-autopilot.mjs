import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateLocks, validateArticles, normalizeKeyword, inventory, validateLiveArticle } from "./seo-autopilot.mjs";
import { repointPost, includeAutopilotGuides } from "../../api/gateway.mjs";
const read = name => JSON.parse(readFileSync(new URL(`../../${name}`, import.meta.url)));
const config = read("seo-autopilot.json"), lock = read(config.keywordLock), posts = read(config.articles);
assert.equal(normalizeKeyword("  Villa PAYROLL-bali! "), "villa payroll bali");
assert.deepEqual(validateLocks(lock), []);
const moved = structuredClone(lock), first = Object.keys(lock.pages)[0];
moved.pages[first].primary = "a reassigned target";
assert.ok(validateLocks(moved, lock).some(e => e.includes("Locked keyword changed")));
const duplicated = structuredClone(lock);
duplicated.pages["/new-page"] = { primary: lock.pages[first].primary.toUpperCase() };
assert.ok(validateLocks(duplicated).some(e => e.includes("Keyword collision")));
assert.deepEqual(validateArticles(posts, lock, config), []);
if (posts.length) {
  const bad = structuredClone(posts);
  bad[0].contentHtml += '<script>alert(1)</script><a href="/invented-guide">bad</a>';
  const failures = validateArticles(bad, lock, config);
  assert.ok(failures.some(e => e.includes("Unsafe")));
  assert.ok(failures.some(e => e.includes("Unknown internal link")));
}
const legacy = "bookkeeping-cleanup-bali-two-years-messy-villa-books";
assert.equal(repointPost({ slug: legacy, primaryKeyword: "bookkeeping cleanup bali" }).primaryKeyword, lock.pages[`/blog/${legacy}`].primary);
const hub = includeAutopilotGuides("<main><h1>Journal</h1></main>");
for (const post of posts) assert.ok(hub.includes(`href="/blog/${post.slug}"`));
assert.equal(includeAutopilotGuides(hub), hub, "hub links are idempotent");
let calls = 0;
const listed = await inventory(async url => {
  const offset = Number(new URL(url).searchParams.get("offset"));
  calls++;
  const size = offset === 0 ? 50 : 2;
  return new Response(JSON.stringify(Array.from({length:size}, (_, i) => ({slug:`post-${offset+i}`}))), {headers:{"content-type":"application/json"}});
});
assert.equal(calls, 2); assert.equal(listed.length, 52);
await assert.rejects(inventory(async () => new Response('[]', {status:503})), /inventory failed/);
await assert.rejects(inventory(async () => new Response(JSON.stringify(Array.from({length:50},()=>({slug:"repeated"}))), {headers:{"content-type":"application/json"}})), /Repeated journal slug/);
console.log("PASS: keyword collisions/reassignment, article validation, gateway ownership, full inventory pagination and failed-read handling.");

const sample = { slug: "source-check", updatedAt: "2026-11-23T01:23:00.000Z", metaTitle: "Source check", metaDescription: "Expected description", imageUrl: "/images/source.webp", contentHtml: '<a href="https://www.airbnb.com/help/article/3389">Primary source</a>' };
const initialHtml = '<head><title>Source check</title><meta name="description" content="Expected description"><link rel="canonical" href="https://example.test/blog/source-check"></head><body><img src="/images/source.webp"><a href="https://www.airbnb.com/help/article/3389">Primary source</a><script>{"static":true,"updatedAt":"2026-11-23T01:23:00.000Z"}</script></body>';
assert.deepEqual(validateLiveArticle(initialHtml, sample, "https://example.test"), []);
assert.ok(validateLiveArticle(initialHtml.replace('<a href="https://www.airbnb.com/help/article/3389">Primary source</a>', ''), sample, "https://example.test").some(e => e.includes("missing rendered link")));
assert.ok(validateLiveArticle(initialHtml.replace(sample.updatedAt, "2026-11-01T00:00:00.000Z"), sample, "https://example.test").includes("expected static revision"));
assert.ok(validateLiveArticle('<script>' + JSON.stringify(sample) + '</script>', sample, "https://example.test").includes("expected rendered image"));
assert.ok(validateLiveArticle(initialHtml.replace('rel="canonical"', 'rel="alternate"'), sample, "https://example.test").includes("expected canonical URL"));
