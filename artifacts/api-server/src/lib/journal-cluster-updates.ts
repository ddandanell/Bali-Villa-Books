import { and, eq } from "drizzle-orm";
import { db, blogPosts, blogRevisions } from "@workspace/db";
import { articleAliases } from "@workspace/site-content";
import { countWords } from "./blog-policy";
import { logger } from "./logger";

const destinations = [
  { test: /visa|kitas|immigration|passport|stay permit|visa.free/i, href: "/business-visa-bali", label: "Bali visa application support" },
  { test: /tax|pph|withholding|expense ratio/i, href: "/tax-compliance-bali", label: "tax compliance support in Bali" },
  { test: /clean.?up|catch.?up|opening balance|messy/i, href: "/villa-bookkeeping-cleanup-bali", label: "bookkeeping cleanup in Bali" },
  { test: /airbnb|booking|ota|payout|cancellation|refund/i, href: "/airbnb-bookkeeping-bali", label: "Airbnb bookkeeping and payout reconciliation" },
  { test: /payroll|bpjs|staff cost/i, href: "/villa-payroll-records-bali", label: "Bali villa payroll records" },
  { test: /company formation|company setup|business categories|foreign investment/i, href: "/company-formation-bali", label: "PT PMA company formation support" },
  { test: /pma|owner funding|owner contribution/i, href: "/pt-pma-villa-bookkeeping", label: "PT PMA villa bookkeeping" },
  { test: /report|statement|cash flow|profit|variance|yield|multi.property/i, href: "/villa-financial-reporting-bali", label: "villa financial reporting in Bali" },
];
export function journalParent(title: string, keyword: string) {
  return destinations.find(item => item.test.test(`${title} ${keyword}`))
    ?? { href: "/services", label: "accounting services in Bali" };
}

/** Add missing contextual commercial links without rewriting facts or deleting history. */
export async function applyJournalClusterUpdates() {
  const rows = await db.select().from(blogPosts);
  const reason = "Contextual parent-service and core accounting links; existing facts preserved";
  let updated = 0;
  for (const row of rows) {
    if (articleAliases[row.slug]) continue;
    await db.transaction(async tx => {
      const [post] = await tx.select().from(blogPosts).where(eq(blogPosts.id, row.id)).for("update");
      const parent = journalParent(post.title, post.primaryKeyword);
      const hrefs = [...post.contentHtml.matchAll(/href="([^"]+)"/g)].map(match => match[1]);
      if (hrefs.includes("/") && hrefs.includes(parent.href)) return;
      const [applied] = await tx.select({ id: blogRevisions.id }).from(blogRevisions)
        .where(and(eq(blogRevisions.postId, post.id), eq(blogRevisions.reason, reason))).limit(1);
      if (applied) return;
      const contentHtml = post.contentHtml + `<h2>Related services and next steps</h2><p>For ongoing records, explore our <a href="/">Bali accounting and villa bookkeeping services</a>. For this topic, see <a href="${parent.href}">${parent.label}</a>. Advice and project work require their own agreed scope; these articles are general information.</p>`;
      const wordCount = countWords(contentHtml);
      await tx.insert(blogRevisions).values({ postId: post.id, previousContent: post, reason });
      await tx.update(blogPosts).set({ contentHtml, wordCount, readTimeMinutes: Math.ceil(wordCount / 220), updatedAt: new Date() }).where(eq(blogPosts.id, post.id));
      updated++;
    });
  }
  logger.info({ reviewed: rows.length, updated }, "Journal service-cluster links checked; previous versions preserved");
}
