import { Router } from "express";
import { desc, eq } from "drizzle-orm";
import { db, blogPosts } from "@workspace/db";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { cleanHtml } from "../lib/blog-content";
import { GetBlogPostResponse, ListBlogPostsResponse } from "@workspace/api-zod";

const router = Router();
// Verified custom domain returned by deployment metadata, not a development domain.
const origin = "https://bali-villa-accounting-service.com";
const escape = (value: string) => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]!));
const safeJson = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
const lastGood = new Map<string, { html: string; savedAt: number }>();
const marketingPaths = ["/", "/services", "/airbnb-bookkeeping-bali", "/villa-financial-reporting-bali", "/villa-bookkeeping-cleanup-bali", "/pt-pma-villa-bookkeeping", "/villa-payroll-records-bali", "/pricing", "/sample-report", "/about", "/get-started", "/faq", "/privacy", "/terms", "/blog"];
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

async function documentHtml(title: string, description: string, canonicalPath: string, content: string, bootstrap: unknown, image: string, schema: unknown) {
  const raw = await template();
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
<meta property="og:image" content="${origin}${escape(image)}"><meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${origin}${escape(image)}">
<script type="application/ld+json">${safeJson({
  "@context": "https://schema.org", "@graph": [
    { ...schema as Record<string, unknown>, "@context": undefined },
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
  const rows = await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt)).limit(51).offset((page - 1) * 50);
  const hasMore = rows.length > 50;
  if (!rows.length && page > 1) { res.status(404).type("html").send('<h1>Guide page not found</h1><a href="/blog">Browse guides</a>'); return; }
  const posts = ListBlogPostsResponse.parse(rows.slice(0, 50));
  const content = `<h1>Bali Villa Bookkeeping Guides</h1><p>Practical bookkeeping, OTA reconciliation and financial reporting guides for Bali villa owners and operators.</p>${posts.map(post => `<article><h2><a href="/blog/${escape(post.slug)}">${escape(post.title)}</a></h2><img src="${escape(post.imageUrl)}" alt="${escape(post.imageAlt)}" width="1024" height="1024" loading="lazy"><p>${escape(post.excerpt)}</p></article>`).join("")}<nav aria-label="Guide pages">${page > 1 ? `<a href="/blog${page === 2 ? "" : `?page=${page - 1}`}">Newer guides</a>` : ""}${hasMore ? ` <a href="/blog?page=${page + 1}">Older guides</a>` : ""}</nav>`;
  sendPage(res, req.originalUrl, await documentHtml("Bali Villa Bookkeeping Guides", "Practical guides to Bali villa bookkeeping, OTA payouts, owner reports and record keeping. Understand the numbers and improve your monthly process.", "/blog", content, { posts, listParams: page === 1 ? { limit: 50 } : { limit: 50, offset: (page - 1) * 50 } }, "/images/bali-account-management-team.jpg", {
    "@context": "https://schema.org", "@type": "CollectionPage", name: "Bali Villa Bookkeeping Guides",
    url: `${origin}/blog`, hasPart: posts.map(post => ({ "@type": "BlogPosting", headline: post.title, url: `${origin}/blog/${post.slug}` })),
  }));
});

router.get("/blog/:slug", async (req, res) => {
  const [row] = await db.select().from(blogPosts).where(eq(blogPosts.slug, req.params.slug));
  if (!row) {
    const html = await documentHtml("Guide Not Found", "This guide could not be found. Browse the Bali villa bookkeeping journal or contact Client Advisory.", `/blog/${req.params.slug}`,
      '<h1>Guide not found</h1><p>This guide does not exist. <a href="/blog">Browse the journal</a> or <a href="/services">explore our services</a>.</p>', {}, "/opengraph.jpg",
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
  const servicePath = /airbnb|payout|booking|ota/i.test(post.slug) ? "/airbnb-bookkeeping-bali" : /cleanup|catch-up|incomplete/i.test(post.slug) ? "/villa-bookkeeping-cleanup-bali" : /pt-pma|tax-adviser/i.test(post.slug) ? "/pt-pma-villa-bookkeeping" : "/villa-financial-reporting-bali";
  const content = `<article><p>${escape(post.category)}</p><h1>${escape(post.title)}</h1><p>${escape(post.excerpt)}</p><time datetime="${post.publishedAt.toISOString()}">${post.publishedAt.toISOString().slice(0, 10)}</time>
<img src="${escape(post.imageUrl)}" alt="${escape(post.imageAlt)}" width="1024" height="1024" fetchpriority="high">
${post.contentHtml}<p><a href="https://wa.me/6281237402292">Speak with Client Advisory</a></p><h2>Related guides</h2><ul>${post.relatedPosts.map(p => `<li><a href="/blog/${escape(p.slug)}">${escape(p.title)}</a></li>`).join("")}</ul></article>`;
  sendPage(res, req.originalUrl, await documentHtml(post.metaTitle, post.metaDescription, `/blog/${post.slug}`, content.replace("</article>", `<p>Need help applying this process? Explore our <a href="${servicePath}">villa bookkeeping service</a>, <a href="/sample-report">sample owner report</a> and <a href="/pricing">package inclusions</a>.</p></article>`), { post }, post.imageUrl, {
    "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.metaDescription,
    image: `${origin}${post.imageUrl}`, datePublished: post.publishedAt, dateModified: post.updatedAt,
    wordCount: post.wordCount, author: { "@id": `${origin}/#business` },
    publisher: { "@id": `${origin}/#business` }, mainEntityOfPage: `${origin}/blog/${post.slug}`,
  }));
});

router.get("/sitemap.xml", async (_req, res) => {
  const posts = await db.select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt }).from(blogPosts);
  const entries = [...marketingPaths.map(url => `<url><loc>${origin}${url}</loc></url>`),
    ...posts.map(post => `<url><loc>${origin}/blog/${escape(post.slug)}</loc><lastmod>${post.updatedAt.toISOString()}</lastmod></url>`)];
  res.set("Cache-Control", "public, max-age=300").type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join("")}</urlset>`);
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
