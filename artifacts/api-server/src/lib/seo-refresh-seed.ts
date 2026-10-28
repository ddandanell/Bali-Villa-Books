import { db, blogPosts } from "@workspace/db";
import refreshPosts from "../data/seo-refresh-2026-10.json";
import expansionPosts from "../data/seo-expansion-2026-10-28.json";
import { logger } from "./logger";

export async function seedSeoRefreshArticles() {
  let inserted = 0;
  const prepared = [...refreshPosts, ...expansionPosts];
  const expansionSlugs = new Set(expansionPosts.map(post => post.slug));
  for (const post of prepared) {
    const rows = await db.insert(blogPosts).values({
      ...post,
      updatedAt: new Date(post.updatedAt),
      publishedAt: new Date(),
      automationKey: expansionSlugs.has(post.slug) ? `seo-expansion:2026-10-28:${post.slug}` : `seo-refresh:2026-10:${post.slug}`,
    }).onConflictDoNothing().returning({ id: blogPosts.id });
    inserted += rows.length;
  }
  logger.info({ inserted, prepared: prepared.length }, "Reviewed SEO refresh articles checked; existing posts retained");
}
