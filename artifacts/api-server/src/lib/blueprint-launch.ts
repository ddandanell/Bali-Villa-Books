import { db, blogPosts } from "@workspace/db";
import { eq } from "drizzle-orm";
import payload from "./blueprint-launch.txt";
import { cleanHtml } from "./blog-content";
import { logger } from "./logger";

type Seed = {
  slug: string; title: string; excerpt: string; metaTitle: string; metaDescription: string;
  primaryKeyword: string; category: string; contentHtml: string; imageUrl: string; imageAlt: string;
  wordCount: number; readTimeMinutes: number; publishedAt: string; updatedAt: string;
};
/** Ship the first completed article and its actual sibling dependencies without overwriting live content. */
export async function seedBlueprintLaunchArticle() {
  const bundle = JSON.parse(payload) as { article?: Seed; relatedPosts?: Seed[] };
  if (!bundle.article) return;
  for (const post of [...(bundle.relatedPosts ?? []), bundle.article]) {
    const [existing] = await db.select({ id: blogPosts.id }).from(blogPosts).where(eq(blogPosts.slug, post.slug));
    if (existing) continue;
    const inserted = await db.insert(blogPosts).values({
      slug: post.slug, title: post.title, excerpt: post.excerpt, metaTitle: post.metaTitle,
      metaDescription: post.metaDescription, primaryKeyword: post.primaryKeyword, category: post.category,
      contentHtml: cleanHtml(post.contentHtml), imageUrl: post.imageUrl, imageAlt: post.imageAlt,
      wordCount: post.wordCount, readTimeMinutes: post.readTimeMinutes,
      publishedAt: new Date(post.publishedAt), updatedAt: new Date(post.updatedAt),
      automationKey: `blueprint-launch:${post.slug}`,
    }).onConflictDoNothing({ target: blogPosts.slug }).returning({ slug: blogPosts.slug });
    if (inserted.length) logger.info({ slug: post.slug }, "Blueprint launch article or linked sibling seeded");
  }
}
