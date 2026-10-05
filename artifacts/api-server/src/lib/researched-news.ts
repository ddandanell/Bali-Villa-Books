import { db, blogPosts } from "@workspace/db";
import { researchedNews } from "../content/indonesia-news";
import { cleanHtml } from "./blog-content";
import { countWords, imageLibrary } from "./blog-policy";
import { logger } from "./logger";

export async function publishResearchedNews() {
  const publishedAt = new Date();
  for (const [index, article] of researchedNews.entries()) {
    const contentHtml = cleanHtml(article.contentHtml);
    const wordCount = countWords(contentHtml);
    if (wordCount < 1000) throw new Error(`Researched article is too short: ${article.slug} (${wordCount})`);
    const image = imageLibrary[index % imageLibrary.length];
    const inserted = await db.insert(blogPosts).values({
      ...article, contentHtml, wordCount, readTimeMinutes: Math.ceil(wordCount / 220),
      category: "Indonesia News & Visas", publishedAt,
      automationKey: `researched-news:2026-10-05:${article.slug}`,
      imageUrl: image.url, imageAlt: "Illustrative Bali business-record planning scene, not a photograph of the reported news event",
    }).onConflictDoNothing({ target: blogPosts.slug }).returning({ slug: blogPosts.slug });
    if (inserted.length) logger.info({ slug: article.slug, wordCount }, "Source-checked Indonesia news article published");
  }
}
