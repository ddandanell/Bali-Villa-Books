/**
 * Guards the gateway artwork shim: the generated map must match the workspace
 * data, and the rewrites must touch only the article hero, its metadata, the hub
 * cards and the sitemap entry, leaving everything else byte-identical.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { journalArt } from "../../api/journal-art.mjs";
import { repointArticleArt, repointHubArt, repointSitemapArt, repointDocument,
  repointPost, repointJson, normaliseCredits } from "../../api/gateway.mjs";

const imagery = JSON.parse(readFileSync("lib/site-content/src/journal-imagery.json", "utf8"));
const expected = Object.fromEntries(Object.entries(imagery)
  .filter(([, art]) => art.imageUrl?.startsWith("/images/journal/") && art.shareImage?.startsWith("/images/share/"))
  .map(([slug, art]) => [slug, { imageUrl: art.imageUrl, shareImage: art.shareImage, imageAlt: art.imageAlt, caption: art.caption ?? "" }]));
assert.deepEqual(journalArt, expected, "api/journal-art.mjs has drifted from journal-imagery.json; run node scripts/src/build-journal-art.mjs");

const slug = "pph-26-bali-villa-records";
const art = journalArt[slug];
assert.ok(art, "fixture slug missing from the art map");
const OLD = "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9b/day_book.jpg/1280px-day_book.jpg?utm_source=commons.wikimedia.org&amp;utm_campaign=imageinfo";
const OLD_RAW = OLD.replace(/&amp;/g, "&");
const OLD_ALT = "Illustrative photo: Dr. A. Louise Klehm&#39;s Day Book and Ledger, 1905 1915";
const OLD_ALT_RAW = OLD_ALT.replace(/&#39;/g, "'");

const article = `<html><head>
<meta property="og:image" content="${OLD}">
<meta property="og:image:secure_url" content="${OLD}">
<meta property="og:image:alt" content="${OLD_ALT}">
<meta name="twitter:image" content="${OLD}">
<meta name="twitter:image:alt" content="${OLD_ALT}">
<script type="application/ld+json">{"@type":"BlogPosting","image":"${OLD_RAW}","headline":"x"}</script>
<script src="/assets/index-abc123.js"></script><link rel="stylesheet" href="/assets/index-def456.css">
</head><body><article><time datetime="2026-10-23">2026-10-23</time>
<img src="${OLD}" alt="${OLD_ALT}" width="1024" height="1024" fetchpriority="high">
<p>Body copy.</p><img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/z/z9/other.jpg" alt="A different inline photograph">
</article></body></html>`;

const out = repointArticleArt(repointDocument(article, `/blog/${slug}`), slug);
assert.ok(out.includes(`content="https://bali-villa-accounting-service.com${art.shareImage}"`), "og/twitter image not repointed to the share card");
assert.ok(out.includes(`"image":"https://bali-villa-accounting-service.com${art.shareImage}"`), "BlogPosting image not repointed");
assert.ok(out.includes(`src="https://bali-villa-accounting-service.com${art.imageUrl}"`), "hero image not repointed");
assert.ok(out.includes(`width="1200" height="750" fetchpriority="high"`), "hero dimensions or fetchpriority lost");
assert.ok(out.includes(`alt="${art.imageAlt.replace(/"/g, "&quot;")}"`), "hero alt not replaced");
assert.ok(out.includes("images/journal") && !out.includes(`<img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9b/day_book.jpg`), "old hero still present");
assert.ok(out.includes("A different inline photograph"), "inline body image removed");
assert.ok(out.includes("/assets/app.js") && out.includes("/assets/app.css"), "asset repointing lost");
assert.equal((out.match(/thumb\.wikimedia\.org/g) ?? []).length, 1, "exactly the inline body image should remain");
const captioned = repointArticleArt(`<article><img src="${OLD}" alt="${OLD_ALT}" fetchpriority="high">
<p><em>Illustrative photo, not a client engagement. Photo credit: . Public domain. <a href="https://commons.wikimedia.org/wiki/File:x.jpg">Original image and attribution</a>. Cropped for display; no endorsement implied.</em></p>
<p><em>General information only: this article is not tax, legal, accounting or immigration advice.</em></p></article>`, slug);
assert.ok(captioned.includes(`<p><em>${art.caption}</em></p>`), "stale image credit not replaced with the local caption");
assert.ok(captioned.includes("General information only"), "scope disclaimer must not be touched");
assert.equal((captioned.match(/Photo credit: \./g) ?? []).length, 0, "empty photo credit survived");

const alreadyLocal = `<article><img src="/images/journal/${art.imageUrl.split("/images/journal/")[1]}" alt="old alt" width="1200" height="750" fetchpriority="high"></article>`;
assert.equal(repointArticleArt(alreadyLocal, slug), alreadyLocal, "a page already carrying this art must not be rewritten");

const unknown = repointArticleArt(article, "not-a-real-slug");
assert.equal(unknown, article, "unknown slug must pass through untouched");

const hub = `<main><article><h2><a href="/blog/${slug}">PPh 26</a></h2><img src="${OLD}" alt="${OLD_ALT}" width="1024" height="1024" loading="lazy"><p>x</p></article>
<article><h2><a href="/blog/villa-petty-cash-reconciliation-vouchers-floats-counts">Petty cash</a></h2><img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/aa/x.jpg" alt="Other" loading="lazy"><p>y</p></article></main>`;
const hubOut = repointHubArt(hub);
assert.ok(hubOut.includes(`https://bali-villa-accounting-service.com${art.imageUrl}`), "hub card not repointed");
assert.ok(hubOut.includes(`loading="lazy"`), "hub loading attribute lost");
assert.ok(hubOut.includes('src="https://thumb.wikimedia.org/wikipedia/commons/thumb/aa/x.jpg"'), "article without local art must be left alone");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset><url><loc>https://bali-villa-accounting-service.com/pricing</loc><image:loc>https://bali-villa-accounting-service.com/images/share/pricing.jpg</image:loc></url><url><loc>https://bali-villa-accounting-service.com/blog/${slug}</loc><lastmod>2026-10-23</lastmod><image:loc>${OLD_RAW}</image:loc></url></urlset>`;
const siteOut = repointSitemapArt(sitemap);
assert.ok(siteOut.includes(`<image:loc>https://bali-villa-accounting-service.com${art.imageUrl}</image:loc>`), "sitemap journal image not repointed");
assert.ok(siteOut.includes("<image:loc>https://bali-villa-accounting-service.com/images/share/pricing.jpg</image:loc>"), "marketing sitemap image changed");
assert.equal(repointSitemapArt(sitemap), siteOut, "sitemap rewrite must be stable");

// ---- Named credits: the empty-credit matcher above is not enough -------------
const NAMED = "<p><em>Illustrative photo, not a client engagement. Photo credit: Erfgoedcel Denderland. CC BY-SA 4.0. <a href=\"https://commons.wikimedia.org/wiki/File:x.jpg\">Original image and attribution</a> · <a href=\"https://creativecommons.org/licenses/by-sa/4.0\">License</a>.</em></p>";
const namedOut = normaliseCredits(NAMED, art.caption);
assert.equal(namedOut, `<p><em>${art.caption}</em></p>`, "a named third-party credit must be replaced, not kept under AI art");

// A page that carries a generic library credit and a named credit collapses to
// one caption, at the position of the first, so the page never shows two.
const DOUBLE = `<p>Body.</p>${NAMED}<p>More body.</p><p><em>Image credit: Bali Accounting’s publisher-selected open-license image library; the pictured people or property are not represented as clients.</em></p>`;
const doubleOut = normaliseCredits(DOUBLE, art.caption);
assert.equal((doubleOut.match(/<p><em>/g) ?? []).length, 1, "exactly one credit paragraph must survive");
assert.ok(doubleOut.includes(`<p><em>${art.caption}</em></p>`), "the surviving credit must be the local caption");
assert.ok(doubleOut.includes("<p>Body.</p>") && doubleOut.includes("<p>More body.</p>"), "body copy must be untouched");
assert.ok(!/wikimedia|publisher-selected/i.test(doubleOut), "no stale credit text may survive");

// A scope or qualification paragraph is never treated as an image credit.
const SCOPE = "<p><em>Scope: general information only. Editorial quality checks are not a licensed professional review. Image credit: none.</em></p>";
assert.equal(normaliseCredits(SCOPE, art.caption), SCOPE, "scope paragraphs must never be rewritten");

// ---- The API record the article page actually renders ------------------------
const apiPost = {
  slug, title: "x", imageUrl: OLD_RAW, imageAlt: OLD_ALT_RAW,
  contentHtml: `<p>Lead.</p>${NAMED}<p><em>Scope: general information only, not tax advice.</em></p>`,
  relatedPosts: [{ slug: "villa-petty-cash-reconciliation-vouchers-floats-counts", imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/x.jpg" }],
};
const apiOut = repointPost(apiPost);
assert.equal(apiOut.imageUrl, `https://bali-villa-accounting-service.com${art.imageUrl}`, "API imageUrl must carry the local hero");
assert.equal(apiOut.imageAlt, art.imageAlt, "API imageAlt must carry the recorded alt");
assert.equal((apiOut.contentHtml.match(/<p><em>/g) ?? []).length, 2, "one caption plus the scope paragraph must survive");
assert.ok(!/Photo credit|wikimedia/i.test(apiOut.contentHtml), "the API body must not keep the stale credit or its link");
assert.ok(apiOut.contentHtml.includes("Scope: general information only"), "the API scope paragraph must be untouched");
assert.equal(apiOut.relatedPosts[0].imageUrl, apiPost.relatedPosts[0].imageUrl, "an unmapped related post must be left alone");
assert.notEqual(apiPost.imageUrl, apiOut.imageUrl, "repointPost must not mutate its input");

// ---- The client seed inside the document ------------------------------------
const seedDoc = `<html><head><meta property="og:image" content="${OLD}"></head><body>`
  + `<main id="journal-server-content"><img src="${OLD}" alt="${OLD_ALT}" width="1024" height="1024">${NAMED}</main>`
  + `<script>window.__BLOG_INITIAL__=${JSON.stringify({ post: apiPost })}</script></body></html>`;
const seedOut = repointDocument(seedDoc, `/blog/${slug}`);
const seedJson = seedOut.slice(seedOut.indexOf("window.__BLOG_INITIAL__=") + "window.__BLOG_INITIAL__=".length, seedOut.lastIndexOf("</script>"));
const seedPost = JSON.parse(seedJson).post;
assert.equal(seedPost.imageUrl, `https://bali-villa-accounting-service.com${art.imageUrl}`, "the seed record must carry the local hero");
assert.equal(seedPost.imageAlt, art.imageAlt, "the seed record must carry the recorded alt");
assert.ok(seedPost.contentHtml.includes(`<p><em>${art.caption}</em></p>`), "the seed body must carry the local caption");
assert.ok(!/Photo credit|wikimedia/i.test(seedPost.contentHtml), "the seed body must not keep the stale credit");
assert.ok(!seedOut.includes("\\u003cscript"), "the seed must stay inside its own script tag");
assert.equal(repointDocument(seedOut, `/blog/${slug}`), seedOut, "a rewritten document must be stable on a second pass");

const settledPost = { slug, imageUrl: `https://bali-villa-accounting-service.com${art.imageUrl}`, imageAlt: art.imageAlt, contentHtml: apiOut.contentHtml };
assert.deepEqual(repointPost(settledPost), settledPost, "a record already carrying this art and this caption must be returned unchanged");
assert.deepEqual(repointPost({ ...settledPost, relatedPosts: apiOut.relatedPosts }), { ...settledPost, relatedPosts: apiOut.relatedPosts }, "a settled record with related posts must be stable");

// The art is already local but the credit still names a third party, which is
// what the previous release left on the page. The record is corrected, not skipped.
const localPost = { slug, imageUrl: `https://bali-villa-accounting-service.com${art.imageUrl}`, imageAlt: art.imageAlt, contentHtml: apiPost.contentHtml };
const repaired = repointPost(localPost);
assert.equal(repaired.imageUrl, localPost.imageUrl, "a local imageUrl must not be rewritten");
assert.ok(repaired.contentHtml.includes(`<p><em>${art.caption}</em></p>`), "a leftover named credit must be replaced");
assert.ok(!/Denderland|wikimedia/i.test(repaired.contentHtml), "the named third party and its link must be gone");

const untouchedPost = { slug: "villa-petty-cash-reconciliation-vouchers-floats-counts", imageUrl: OLD_RAW, contentHtml: NAMED };
assert.deepEqual(repointPost(untouchedPost), untouchedPost, "an article with no local art must keep its own credit");

assert.equal(repointJson(JSON.stringify(apiPost), `/api/blog/posts/${slug}`),
  JSON.stringify(repointPost(apiPost)), "single-record endpoint");
assert.equal(repointJson(JSON.stringify([apiPost, untouchedPost]), "/api/blog/posts"),
  JSON.stringify([repointPost(apiPost), untouchedPost]), "list endpoint");
assert.equal(repointJson(JSON.stringify(apiPost), "/api/blog/automation/status"), JSON.stringify(apiPost), "other JSON endpoints pass through");

const marketing = "<html><body><h1>Pricing</h1></body></html>";
assert.equal(repointDocument(marketing, "/pricing"), marketing, "marketing pages must pass through untouched");

console.log(`PASS: journal art shim — ${Object.keys(journalArt).length} articles mapped, article/hub/sitemap rewrites verified, unrelated markup untouched.`);
