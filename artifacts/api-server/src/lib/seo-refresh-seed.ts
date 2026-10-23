import { db, blogPosts } from "@workspace/db";
import refreshPosts from "../data/seo-refresh-2026-10.json";
import { logger } from "./logger";

export async function seedSeoRefreshArticles() {
  let inserted = 0;
  for (const post of refreshPosts) {
    const rows = await db.insert(blogPosts).values({
      ...post,
      updatedAt: new Date(post.updatedAt),
      publishedAt: new Date(),
      automationKey: `seo-refresh:2026-10:${post.slug}`,
    }).onConflictDoNothing().returning({ id: blogPosts.id });
    inserted += rows.length;
  }
  logger.info({ inserted, prepared: refreshPosts.length }, "Reviewed SEO refresh articles checked; existing posts retained");
}
