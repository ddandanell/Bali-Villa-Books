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
<script type="application/ld+json">${safeJson(schema)}</script>
<style>body{margin:0;background:#f8f7f3;color:#173c31;font:18px/1.7 sans-serif}.server-article{max-width:900px;margin:70px auto;padding:24px}img{max-width:100%;height:auto;border-radius:24px}a{color:#a55637}h1{line-height:1.2;font-size:42px}nav{margin-bottom:32px}</style>
${scriptsAndStyles}</head><body><main id="journal-server-content" class="server-article"><nav><a href="/">Bali Accounting</a> · <a href="/blog">Journal</a> · <a href="/#services">Services</a></nav>${content}</main>
<div id="root"></div><script>window.__BLOG_INITIAL__=${safeJson(bootstrap)};</script></body></html>`;
}

router.get("/blog", async (_req, res) => {
  const rows = await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt)).limit(50);
  const posts = ListBlogPostsResponse.parse(rows);
  const content = `<h1>Bali villa accounting journal</h1><p>Practical bookkeeping, OTA reconciliation and financial reporting guides for Bali villa owners and operators.</p>${posts.map(post => `<article><h2><a href="/blog/${escape(post.slug)}">${escape(post.title)}</a></h2><img src="${escape(post.imageUrl)}" alt="${escape(post.imageAlt)}" width="1024" height="1024" loading="lazy"><p>${escape(post.excerpt)}</p></article>`).join("")}`;
  res.set("Cache-Control", "public, max-age=60").type("html").send(await documentHtml("Bali Villa Accounting Guides", "Practical accounting guidance for Bali villa owners: bookkeeping, OTA payouts, owner financial reporting and record preparation.", "/blog", content, { posts }, "/images/bali-account-management-team.jpg", {
    "@context": "https://schema.org", "@type": "CollectionPage", name: "Bali Accounting Journal",
    url: `${origin}/blog`, hasPart: posts.map(post => ({ "@type": "BlogPosting", headline: post.title, url: `${origin}/blog/${post.slug}` })),
  }));
});

router.get("/blog/:slug", async (req, res) => {
  const [row] = await db.select().from(blogPosts).where(eq(blogPosts.slug, req.params.slug));
  if (!row) { res.status(404).type("html").send('<h1>Guide not found</h1><a href="/blog">Browse the journal</a>'); return; }
  const related = await db.select().from(blogPosts).where(eq(blogPosts.category, row.category)).limit(4);
  const peers = related.filter(post => post.slug !== row.slug);
  if (peers.length < 2) {
    const recent = await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt)).limit(4);
    for (const post of recent) if (post.slug !== row.slug && !peers.some(p => p.slug === post.slug)) peers.push(post);
  }
  const post = GetBlogPostResponse.parse({ ...row, contentHtml: cleanHtml(row.contentHtml), relatedPosts: peers.slice(0, 3) });
  const content = `<article><p>${escape(post.category)}</p><h1>${escape(post.title)}</h1><p>${escape(post.excerpt)}</p><time datetime="${post.publishedAt.toISOString()}">${post.publishedAt.toISOString().slice(0, 10)}</time>
<img src="${escape(post.imageUrl)}" alt="${escape(post.imageAlt)}" width="1024" height="1024" fetchpriority="high">
${post.contentHtml}<p><a href="https://wa.me/6281237402292">Speak with Client Advisory</a></p><h2>Related guides</h2><ul>${post.relatedPosts.map(p => `<li><a href="/blog/${escape(p.slug)}">${escape(p.title)}</a></li>`).join("")}</ul></article>`;
  res.set("Cache-Control", "public, max-age=60").type("html").send(await documentHtml(post.metaTitle, post.metaDescription, `/blog/${post.slug}`, content, { post }, post.imageUrl, {
    "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.metaDescription,
    image: `${origin}${post.imageUrl}`, datePublished: post.publishedAt, dateModified: post.updatedAt,
    wordCount: post.wordCount, author: { "@type": "Organization", name: "Bali Accounting" },
    publisher: { "@type": "Organization", name: "Bali Accounting" }, mainEntityOfPage: `${origin}/blog/${post.slug}`,
  }));
});

router.get("/sitemap.xml", async (_req, res) => {
  const posts = await db.select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt }).from(blogPosts);
  const entries = [`<url><loc>${origin}/</loc></url>`, `<url><loc>${origin}/blog</loc></url>`,
    ...posts.map(post => `<url><loc>${origin}/blog/${escape(post.slug)}</loc><lastmod>${post.updatedAt.toISOString()}</lastmod></url>`)];
  res.set("Cache-Control", "public, max-age=300").type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join("")}</urlset>`);
});
export default router;
