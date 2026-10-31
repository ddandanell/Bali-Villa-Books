import { db, blogPosts, blogRevisions } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

/** Internal cluster codes that were never meant to be public labels. */
const internalCode = /^(SEO|[A-H])$/;

/**
 * Only internal codes are remapped. The many legitimate-looking legacy labels
 * ("Villa Accounting", "Bali Villa Accounting", …) are left alone: collapsing
 * them into one taxonomy is an editorial decision, not a startup repair.
 */
function repairCategory(slug: string, current: string): string {
  if (!internalCode.test(current.trim())) return current;
  if (/booking|airbnb|ota|agoda|vrbo|direct-booking/.test(slug)) return "OTA Operations";
  if (/cleanup|catch-up|migration|opening-balances/.test(slug)) return "Bookkeeping Cleanup";
  if (/payroll|staff-advances|bpjs/.test(slug)) return "Villa Payroll Records";
  if (/pt-pma|pma-|company-formation|business-licensing/.test(slug)) return "PT PMA Bookkeeping";
  if (/visa|kitas|immigration|entry-permit|business-categories/.test(slug)) return "Indonesia News & Visas";
  if (/expense-ratio|tax-record|tax-filing|pph-|coretax/.test(slug)) return "Villa Accounting and Tax Records";
  return "Villa Bookkeeping";
}

/**
 * Repairs records written before the public category allowlist existed and
 * strips image credits whose author field resolved to an empty string
 * ("Photo credit: ."). Idempotent: a clean row is never rewritten, and every
 * change keeps the previous version in blog_revisions.
 */
export async function applyJournalRecordRepairs() {
  let categories = 0;
  let credits = 0;
  const rows = await db.select().from(blogPosts);
  for (const post of rows) {
    const category = repairCategory(post.slug, post.category);
    const contentHtml = post.contentHtml.replace(/Photo credit: \. /g, "");
    if (category === post.category && contentHtml === post.contentHtml) continue;
    await db.transaction(async tx => {
      await tx.insert(blogRevisions).values({
        postId: post.id,
        previousContent: post,
        reason: "Repair non-public journal category and empty photo credit attribution",
      });
      await tx.update(blogPosts).set({ category, contentHtml, updatedAt: new Date() })
        .where(eq(blogPosts.id, post.id));
    });
    if (category !== post.category) categories++;
    if (contentHtml !== post.contentHtml) credits++;
  }
  logger.info({ categories, credits }, "Journal records repaired: public categories restored, empty photo credits removed");
}
