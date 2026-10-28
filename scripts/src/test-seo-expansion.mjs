import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = name => JSON.parse(readFileSync(new URL(`../../${name}`, import.meta.url)));
const posts = read("artifacts/api-server/src/data/seo-expansion-2026-10-28.json");
const topics = read("lib/site-content/src/seo-priority-topics.json");
const strategy = read("lib/site-content/src/seo-strategy.json");
const visuals = read("lib/site-content/src/journal-imagery.json");
assert.equal(posts.length, 8);
assert.equal(new Set(posts.map(p => p.slug)).size, 8);
assert.equal(new Set(posts.map(p => p.primaryKeyword)).size, 8);
assert.equal(new Set(posts.map(p => p.imageUrl)).size, 8);
for (const post of posts) {
  const topic = topics.find(t => t.primaryKeyword === post.primaryKeyword || t.keyword === post.primaryKeyword);
  assert.ok(topic, post.slug);
  assert.ok(post.wordCount >= 1500 && post.wordCount <= 2500, post.slug);
  assert.ok(post.metaTitle.length >= 20 && post.metaTitle.length <= 43, post.slug);
  assert.ok(post.metaDescription.length >= 90 && post.metaDescription.length <= 160, post.slug);
  assert.ok(post.contentHtml.includes(`href="${topic.service}"`), `${post.slug}: parent service`);
  assert.ok(post.contentHtml.includes('href="/"'), `${post.slug}: main accounting page`);
  assert.ok(new Set([...post.contentHtml.matchAll(/href="\/blog\/([^"]+)"/g)].map(m => m[1])).size >= 2, `${post.slug}: sibling links`);
  assert.ok(strategy.clusters.some(c => c.guides.some(g => g.href === `/blog/${post.slug}`)), `${post.slug}: inbound money-page link`);
  assert.equal(post.imageUrl, visuals[post.slug].imageUrl);
  assert.ok(visuals[post.slug].imageAlt.length <= 180);
}
const catalog = Object.values(visuals);
assert.equal(new Set(catalog.map(v => v.imageUrl)).size, catalog.length);
assert.equal(new Set(catalog.map(v => v.shareImage)).size, catalog.length);
console.log(`PASS: eight distinct reviewed articles, ${posts.reduce((n,p) => n+p.wordCount,0)} words, valid metadata, reciprocal money-page links and unique primary/share images.`);
