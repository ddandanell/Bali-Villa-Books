import { db, blogPosts, blogRevisions } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import { journalImagery } from "@workspace/site-content";
import { countWords } from "./blog-policy";
import { logger } from "./logger";

/** Curated cover replacements are idempotent and preserve the previous article. */
export async function applyJournalImageryUpdates() {
  let updated = 0;
  for (const [slug, visual] of Object.entries(journalImagery)) {
    await db.transaction(async tx => {
      const [post] = await tx.select().from(blogPosts).where(eq(blogPosts.slug, slug)).for("update");
      if (!post || post.imageUrl === visual.imageUrl) return;
      const reason = "Unique topic-aligned editorial cover; preserve original article and source references";
      const [applied] = await tx.select({ id: blogRevisions.id }).from(blogRevisions)
        .where(and(eq(blogRevisions.postId, post.id), eq(blogRevisions.reason, reason))).limit(1);
      if (applied) return;
      const legacy = post.imageUrl.startsWith("/images/bali-") || post.imageUrl.includes("Le_Meridien_Nirwana_Bali_Villa_entrance");
      if (!legacy) return; // Never overwrite a later client-approved replacement.
      const contentHtml = post.contentHtml.replace(
        /<p><em>Illustrative photo, not a client property\. Photo credit:[\s\S]*?<\/em><\/p>/g,
        `<p><em>${visual.caption}</em></p>`,
      );
      const wordCount = countWords(contentHtml);
      await tx.insert(blogRevisions).values({
        postId: post.id, previousContent: post,
        reason,
      });
      await tx.update(blogPosts).set({
        imageUrl: visual.imageUrl, imageAlt: visual.imageAlt,
        contentHtml, wordCount, readTimeMinutes: Math.ceil(wordCount / 220), updatedAt: new Date(),
      }).where(eq(blogPosts.id, post.id));
      updated++;
    });
  }
  logger.info({ updated }, "Unique journal cover imagery applied; previous versions preserved");
}
