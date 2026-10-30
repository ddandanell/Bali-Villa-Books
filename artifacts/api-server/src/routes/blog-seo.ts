import { Router } from "express";
import { notInArray } from "drizzle-orm";
import { articleAliases } from "@workspace/site-content";
import { desc, eq } from "drizzle-orm";
import { db, blogPosts } from "@workspace/db";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { cleanHtml } from "../lib/blog-content";
import { articleFaqs } from "../lib/editorial-blueprint";
import { GetBlogPostResponse, ListBlogPostsResponse } from "@workspace/api-zod";
import { pageImagery, journalImagery, publicPagePaths } from "@workspace/site-content";

const router = Router();
// Verified custom domain returned by deployment metadata, not a development domain.
const origin = "https://bali-villa-accounting-service.com";
const defaultShareImage = pageImagery["/"].shareImage;
const journalShareImage = pageImagery["/blog"].shareImage;
const escape = (value: string) => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]!));
const safeJson = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
const lastGood = new Map<string, { html: string; savedAt: number }>();
const marketingPaths = publicPagePaths;
router.use((req, res, next) => {
  const normalized = req.path.replace(/\/+$/, "") || "/";
  if (normalized !== req.path) { res.redirect(308, `${normalized}${req.originalUrl.slice(req.path.length)}`); return; }
  next();
});
function sendPage(res: import("express").Response, key: string, html: string) {
  if (lastGood.size > 300) lastGood.delete(lastGood.keys().next().value!);
  lastGood.set(key, { html, savedAt: Date.now() });
  res.set("Cache-Control", "public, max-age=60").type("html").send(html);
}

async function template() {
  if (process.env.NODE_ENV !== "production") {
    // Development only: obtain Vite's transformed HTML via the shared proxy (includes React refresh).
    const response = await fetch("http://localhost:80/");
    if (!response.ok) throw new Error("Cannot load development page template");
    return response.text();
  }
  return readFile(path.resolve("artifacts/villabooks-bali/dist/public/index.html"), "utf8");
}

async function documentHtml(title: string, description: string, canonicalPath: string, content: string, bootstrap: unknown, image: string, schema: unknown, imageAlt?: string, imageVersion?: string) {
  if (canonicalPath.split("?")[0] === "/blog") {
    const visual = pageImagery["/blog"];
    content = content.replace("</h1>", `</h1><figure><img src="${visual.imageUrl}" alt="${escape(visual.imageAlt)}" width="${visual.width}" height="${visual.height}" fetchpriority="high"><figcaption>${escape(visual.caption)}</figcaption></figure>`);
  }
  const raw = await template();
  const parsedImage = new URL(image, origin);
  if (imageVersion && parsedImage.origin === origin) parsedImage.searchParams.set("v", imageVersion);
  const imageUrl = parsedImage.href;
  const socialAlt = imageAlt ?? (canonicalPath.split("?")[0] === "/blog" ? "Bali Accounting Journal — practical guides for better villa records" : "Bali Accounting — villa bookkeeping and clear owner reports");
  const branded = parsedImage.pathname.startsWith("/images/share/");
  const faqs = articleFaqs(content);
  const scriptsAndStyles = [
    ...(raw.match(/<script\b[^>]*type="module"[\s\S]*?<\/script>/gi) ?? []),
    ...(raw.match(/<script\b[^>]*>[\s\S]*?@react-refresh[\s\S]*?<\/script>/gi) ?? []),
    ...(raw.match(/<link[^>]*(?:rel="stylesheet"|rel="modulepreload")[^>]*>/gi) ?? []),
  ].filter((value, index, values) => values.indexOf(value) === index).join("\n");
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(title)} | Bali Accounting</title><meta name="description" content="${escape(description)}">
<link rel="canonical" href="${origin}${escape(canonicalPath)}">
<meta property="og:type" content="${canonicalPath === "/blog" ? "website" : "article"}"><meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${origin}${escape(canonicalPath)}">
<meta property="og:image" content="${escape(imageUrl)}"><meta property="og:image:secure_url" content="${escape(imageUrl)}"><meta property="og:image:alt" content="${escape(socialAlt)}">
${branded ? '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:type" content="image/jpeg">' : ""}
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image:alt" content="${escape(socialAlt)}">
<meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${escape(imageUrl)}">
<script type="application/ld+json">${safeJson({
  "@context": "https://schema.org", "@graph": [
    { ...schema as Record<string, unknown>, "@context": undefined },
    ...(faqs.length ? [{ "@type": "FAQPage", "@id": `${origin}${canonicalPath}#faq`,
      mainEntity: faqs.map(faq => ({ "@type": "Question", name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }] : []),
    { "@type": "AccountingService", "@id": `${origin}/#business`, name: "Bali Accounting", url: `${origin}/`, telephone: "+6281237402292" },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${origin}/blog` },
      ...(canonicalPath === "/blog" ? [] : [{ "@type": "ListItem", position: 3, name: title, item: `${origin}${canonicalPath}` }]),
    ] },
  ],
})}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<style>body{margin:0;background:#f8f7f3;color:#173c31;font:18px/1.7 sans-serif}.server-article{max-width:900px;margin:70px auto;padding:24px}img{max-width:100%;height:auto;border-radius:24px}a{color:#a55637}h1{line-height:1.2;font-size:42px}nav{margin-bottom:32px}</style>
${scriptsAndStyles}</head><body><main id="journal-server-content" class="server-article"><nav aria-label="Main navigation"><a href="/">Bali Accounting</a> · <a href="/services">Services</a> · <a href="/pricing">Pricing</a> · <a href="/sample-report">Sample Report</a> · <a href="/about">About</a> · <a href="/blog">Guides</a> · <a href="/get-started">Contact</a></nav><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/blog">Guides</a>${canonicalPath === "/blog" ? "" : ` / <span>${escape(title)}</span>`}</nav>${content}<footer><a href="/privacy">Privacy</a> · <a href="/terms">Website terms</a> · <a href="tel:+6281237402292">Call Client Advisory</a> · <a href="https://wa.me/6281237402292">WhatsApp</a></footer></main>
<div id="root"></div><script>window.__BLOG_INITIAL__=${safeJson(bootstrap)};</script></body></html>`;
}

router.get("/blog", async (req, res) => {
  const page = Number(req.query.page ?? 1);
  if (!Number.isInteger(page) || page < 1 || page > 10000) { res.status(400).send("Invalid guide page"); return; }
  const rows = await db.select().from(blogPosts).where(notInArray(blogPosts.slug, Object.keys(articleAliases))).orderBy(desc(blogPosts.publishedAt)).limit(51).offset((page - 1) * 50);
  const hasMore = rows.length > 50;
  if (!rows.length && page > 1) { res.status(404).type("html").send('<h1>Guide page not found</h1><a href="/blog">Browse guides</a>'); return; }
  const posts = ListBlogPostsResponse.parse(rows.filter(row => !articleAliases[row.slug]).slice(0, 50));
  const content = `<h1>Bali Villa Bookkeeping Guides</h1><p>Learn how to reconcile Airbnb payouts, track rental property expenses and review monthly villa P&amp;L and cash flow. Our practical guides connect reporting questions with the source records behind them.</p>${posts.map(post => `<article><h2><a href="/blog/${escape(post.slug)}">${escape(post.title)}</a></h2><img src="${escape(post.imageUrl)}" alt="${escape(post.imageAlt)}" width="1024" height="1024" loading="lazy"><p>${escape(post.excerpt)}</p></article>`).join("")}<nav aria-label="Guide pages">${page > 1 ? `<a href="/blog${page === 2 ? "" : `?page=${page - 1}`}">Newer guides</a>` : ""}${hasMore ? ` <a href="/blog?page=${page + 1}">Older guides</a>` : ""}</nav>
<section><h2>Start with the monthly villa bookkeeping workflow</h2>
<p>The monthly checklist explains how to collect bank exports, platform settlements, supplier invoices and owner notes before preparing a report. Use the Airbnb reconciliation guide when a booking total does not match the bank receipt. Read the owner-report guide when you need to distinguish operating profit, cash timing and owner movements.</p>
<p>These articles support practical rental property bookkeeping. They do not promise platform integrations, tax savings or guaranteed business results. Choose the guide closest to your current record question, then use the service pages to confirm what can be included in an engagement.</p>
<ul><li><a href="/blog/monthly-bali-villa-bookkeeping-checklist">Monthly bookkeeping checklist</a></li><li><a href="/blog/reconciling-airbnb-booking-payouts">Reconcile Airbnb and Booking.com payouts</a></li><li><a href="/blog/bali-villa-owner-statement-template">Monthly owner statement guide</a></li></ul></section>
<section><h2>Keep expense controls and cash planning connected</h2>
<p>Expense tracking starts with the document behind a cost, the property it belongs to and the person responsible for clarification. A management pack brings those records together with booking and cash views. A forecast then makes future receipt and payment assumptions visible; it is not evidence that the projected amount will be received.</p>
<p>Dated Indonesia news and practical guides are general information, not individual tax, legal or immigration advice. Our in-house team offers separately scoped company, tax and visa support. Read each article's sources and limitations; a headline is not an eligibility assessment or permission to operate or work.</p>
<ul><li><a href="/blog/bali-villa-chart-of-accounts">Villa expense classification guide</a></li><li><a href="/blog/bali-villa-cash-flow-forecast">Villa cash-flow forecast guide</a></li><li><a href="/services">Explore monthly bookkeeping services</a></li></ul></section>`;
  const archivePath = page === 1 ? "/blog" : `/blog?page=${page}`;
  sendPage(res, req.originalUrl, await documentHtml(page === 1 ? "Bali Villa Bookkeeping & Airbnb Guides" : `Bali Accounting Journal — Page ${page}`, "Practical Bali villa bookkeeping guides: Airbnb reconciliation, expense tracking, monthly owner reports and cash-flow forecasts, plus source-checked news.", archivePath, content, { posts, listParams: page === 1 ? { limit: 50 } : { limit: 50, offset: (page - 1) * 50 } }, journalShareImage, {
    "@context": "https://schema.org", "@type": "CollectionPage", name: "Bali Villa Bookkeeping Guides",
    url: `${origin}${archivePath}`, hasPart: posts.map(post => ({ "@type": "BlogPosting", headline: post.title, url: `${origin}/blog/${post.slug}` })),
  }));
});

router.get("/blog/:slug", async (req, res) => {
  const [row] = await db.select().from(blogPosts).where(eq(blogPosts.slug, req.params.slug));
  if (!row) {
    const html = await documentHtml("Guide Not Found", "This guide could not be found. Browse the Bali villa bookkeeping journal or contact Client Advisory.", `/blog/${req.params.slug}`,
      '<h1>Guide not found</h1><p>This guide does not exist. <a href="/blog">Browse the journal</a> or <a href="/services">explore our services</a>.</p>', {}, defaultShareImage,
      { "@type": "WebPage", name: "Guide not found" });
    res.status(404).set({ "Cache-Control": "no-store", "X-Robots-Tag": "noindex" }).type("html").send(html.replace("</head>", '<meta name="robots" content="noindex,follow"></head>')); return;
  }
  const related = await db.select().from(blogPosts).where(eq(blogPosts.category, row.category)).limit(4);
  const peers = related.filter(post => post.slug !== row.slug);
  if (peers.length < 2) {
    const recent = await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt)).limit(4);
    for (const post of recent) if (post.slug !== row.slug && !peers.some(p => p.slug === post.slug)) peers.push(post);
  }
  const post = GetBlogPostResponse.parse({ ...row, contentHtml: cleanHtml(row.contentHtml), relatedPosts: peers.slice(0, 3) });
  const servicePath = /airbnb|payout|booking|ota/i.test(post.slug) ? "/airbnb-ota-reconciliation-bali" : /cleanup|catch-up|incomplete/i.test(post.slug) ? "/villa-bookkeeping-cleanup-bali" : /pt-pma|tax-adviser/i.test(post.slug) ? "/pt-pma-villa-bookkeeping" : "/villa-financial-reporting-bali";
  const content = `<article><p>${escape(post.category)}</p><h1>${escape(post.title)}</h1><p>${escape(post.excerpt)}</p><time datetime="${post.publishedAt.toISOString()}">${post.publishedAt.toISOString().slice(0, 10)}</time>
<img src="${escape(post.imageUrl)}" alt="${escape(post.imageAlt)}" width="${journalImagery[post.slug]?.width ?? 1024}" height="${journalImagery[post.slug]?.height ?? 1024}" fetchpriority="high">
<p>By Bali Accounting editorial desk · Editorial updated ${post.updatedAt.toISOString().slice(0,10)}. General information, not a claim of licensed professional review.</p>
${post.contentHtml}<p><a href="https://wa.me/6281237402292">Speak with Client Advisory</a></p><h2>Related guides</h2><ul>${post.relatedPosts.map(p => `<li><a href="/blog/${escape(p.slug)}">${escape(p.title)}</a></li>`).join("")}</ul></article>`;
  const articleVisual = journalImagery[post.slug];
  const articleShare = articleVisual?.imageUrl === post.imageUrl ? articleVisual.shareImage : post.imageUrl;
  sendPage(res, req.originalUrl, await documentHtml(post.metaTitle, post.metaDescription, `/blog/${post.slug}`, content.replace("</article>", `<p>Need help applying this process? Explore the <a href="${servicePath}">relevant service scope</a>, <a href="/sample-report">sample owner report</a> and <a href="/pricing">bookkeeping package inclusions</a>.</p></article>`), { post }, articleShare, {
    "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.metaDescription,
    image: new URL(post.imageUrl, origin).href, datePublished: post.publishedAt, dateModified: post.updatedAt,
    wordCount: post.wordCount, author: { "@id": `${origin}/#business` },
    publisher: { "@id": `${origin}/#business` }, mainEntityOfPage: `${origin}/blog/${post.slug}`,
  }, post.imageAlt, String(post.updatedAt.getTime())));
});

router.get("/sitemap.xml", async (_req, res) => {
  const posts = await db.select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt, imageUrl: blogPosts.imageUrl }).from(blogPosts).where(notInArray(blogPosts.slug, Object.keys(articleAliases)));
  const imageEntry = (url: string) => `<image:image><image:loc>${escape(new URL(url, origin).href)}</image:loc></image:image>`;
  const entries = [...marketingPaths.map(url => `<url><loc>${origin}${url}</loc><lastmod>${pageImagery[url].updatedAt}</lastmod>${imageEntry(pageImagery[url].imageUrl)}</url>`),
    ...posts.map(post => `<url><loc>${origin}/blog/${escape(post.slug)}</loc><lastmod>${post.updatedAt.toISOString()}</lastmod>${imageEntry(post.imageUrl)}</url>`)];
  res.set("Cache-Control", "public, max-age=60").type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${entries.join("")}</urlset>`);
});
router.use((error: unknown, req: import("express").Request, res: import("express").Response, _next: import("express").NextFunction) => {
  req.log.error({ errorName: error instanceof Error ? error.name : "UnknownError" }, "Public journal response failed");
  const cached = lastGood.get(req.originalUrl);
  if (cached && Date.now() - cached.savedAt < 7 * 86400000) {
    res.set({ "Cache-Control": "public, max-age=30", Warning: '110 - "Serving last available version"' }).type("html").send(cached.html); return;
  }
  res.status(503).set({ "Cache-Control": "no-store", "Retry-After": "60" }).type("html").send('<h1>Guides temporarily unavailable</h1><p>Please try again shortly.</p><a href="/services">View bookkeeping services</a> · <a href="https://wa.me/6281237402292">Contact Client Advisory on WhatsApp</a>');
});
export default router;
