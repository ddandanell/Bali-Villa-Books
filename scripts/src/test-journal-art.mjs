/**
 * Guards the gateway artwork shim: the generated map must match the workspace
 * data, and the rewrites must touch only the article hero, its metadata, the hub
 * cards and the sitemap entry, leaving everything else byte-identical.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { journalArt } from "../../api/journal-art.mjs";
import { repointArticleArt, repointHubArt, repointSitemapArt, repointDocument } from "../../api/gateway.mjs";

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

const marketing = "<html><body><h1>Pricing</h1></body></html>";
assert.equal(repointDocument(marketing, "/pricing"), marketing, "marketing pages must pass through untouched");

console.log(`PASS: journal art shim — ${Object.keys(journalArt).length} articles mapped, article/hub/sitemap rewrites verified, unrelated markup untouched.`);
