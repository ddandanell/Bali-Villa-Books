import { test } from "node:test";
import assert from "node:assert/strict";
import { baliClock, nextPublication, countWords, similarTitle, imageLibrary } from "./blog-policy";
import { validateArticle, cleanHtml } from "./blog-content";

test("Bali weekday trigger opens at 09:00 and ignores weekends", () => {
  assert.equal(baliClock(new Date("2026-10-05T00:59:00Z")).eligible, false);
  assert.equal(baliClock(new Date("2026-10-05T01:00:00Z")).eligible, true);
  assert.equal(baliClock(new Date("2026-10-09T12:00:00Z")).eligible, true);
  assert.equal(baliClock(new Date("2026-10-10T02:00:00Z")).eligible, false);
  assert.equal(baliClock(new Date("2026-10-11T02:00:00Z")).eligible, false);
  assert.equal(baliClock(new Date("2026-10-04T17:00:00Z")).dateKey, "2026-10-05");
  assert.equal(baliClock(new Date("2026-10-08T03:00:00Z")).weekKey, "2026-10-05");
});

test("next scheduled publication skips Saturday and Sunday", () => {
  assert.equal(nextPublication(new Date("2026-10-09T01:05:00Z"), true).toISOString(), "2026-10-12T01:00:00.000Z");
  assert.equal(nextPublication(new Date("2026-10-05T00:00:00Z"), false).toISOString(), "2026-10-05T01:00:00.000Z");
});

const existing = [
  { slug: "monthly-checklist", title: "Monthly villa bookkeeping checklist", primaryKeyword: "monthly villa checklist" },
  { slug: "ota-reconciliation", title: "Airbnb OTA reconciliation", primaryKeyword: "OTA reconciliation Bali" },
];
const article = {
  slug: "supplier-invoice-records-bali", title: "How Bali villa operators organize supplier invoices",
  primaryKeyword: "supplier invoice records for Bali villas",
  excerpt: "A practical guide to organizing invoices, keeping supplier records clear, and preparing a monthly property review.",
  metaTitle: "Supplier Invoice Records for Bali Villas",
  metaDescription: "Organize supplier invoices for your Bali villa with a practical document workflow, clear expense categories and a reliable monthly review process.",
  category: "Expense Controls", imageUrl: imageLibrary[0].url, imageAlt: imageLibrary[0].alt,
  contentHtml: "<h2>Overview</h2><h2>Records</h2><h2>Review</h2><h2>Actions</h2><p>" +
    Array.from({ length: 1010 }, () => "bookkeeping").join(" ") +
    '</p><p><a href="/#services">Services</a><a href="/blog/monthly-checklist">Checklist</a><a href="/blog/ota-reconciliation">Reconcile</a></p>',
};

test("word counter counts visible words rather than HTML length", () => {
  assert.equal(countWords("<p>One two &amp; three.</p>"), 3);
  assert.throws(() => validateArticle({ ...article, contentHtml: "<p>" + "x".repeat(10000) + "</p>" }, existing), /minimum/);
});

test("article validator enforces minimum words, image library and real internal links", () => {
  assert.ok(validateArticle(article, existing).wordCount >= 1000);
  assert.throws(() => validateArticle({ ...article, imageUrl: "https://unknown.example/image.jpg" }, existing), /verified/);
  assert.throws(() => validateArticle({ ...article, contentHtml: article.contentHtml.replace("/#services", "/#imaginary") }, existing), /required/);
  assert.throws(() => validateArticle({ ...article, contentHtml: article.contentHtml + '<a href="/blog/missing">Missing</a>' }, existing), /Unknown/);
  assert.throws(() => validateArticle({ ...article, primaryKeyword: existing[0].primaryKeyword }, existing), /Duplicate/);
});

test("HTML sanitizer removes scripts, dangerous attributes and external protocols", () => {
  const safe = cleanHtml('<script>alert(1)</script><p onclick=alert(2)>Useful</p><a href="javascript:alert(1)">bad</a><a href="//evil.example">bad</a><img src=x onerror=alert(1)>');
  assert.equal(safe.includes("<script"), false);
  assert.equal(safe.includes("onclick"), false);
  assert.equal(safe.includes("javascript:"), false);
  assert.equal(safe.includes("//evil"), false);
  assert.equal(safe.includes("<img"), false);
});

test("similar topics are rejected without treating every villa keyword as a duplicate", () => {
  assert.equal(similarTitle("Monthly villa bookkeeping checklist", "Monthly villa bookkeeping checklist guide"), true);
  assert.equal(similarTitle("Monthly villa bookkeeping checklist", article.title), false);
});
