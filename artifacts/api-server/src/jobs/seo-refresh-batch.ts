import { readFile, writeFile, mkdir } from "node:fs/promises";
import { db, pool, blogPosts } from "@workspace/db";
import { createBlueprintArticle, repairDraftAfterReview, reviewPreparedDraft } from "../lib/journal-writer";
import { validateArticle } from "../lib/blog-content";
import { journalImagery } from "@workspace/site-content";
import type { BlueprintTopic } from "../lib/editorial-blueprint";

// This utility is bundled into artifacts/api-server/dist before execution.
const root = new URL("../../../", import.meta.url);
try {
  const topics: (BlueprintTopic & { slug: string })[] = JSON.parse(await readFile(new URL(".local/seo-refresh-topics.json", root), "utf8"));
  const local = await db.select({ slug: blogPosts.slug, title: blogPosts.title, primaryKeyword: blogPosts.primaryKeyword, imageUrl: blogPosts.imageUrl }).from(blogPosts);
  const response = await fetch("https://bali-villa-accounting-service.com/api/blog/posts?limit=50");
  if (!response.ok) throw new Error("Cannot check production article coverage");
  const live = await response.json() as typeof local;
  const existing = [...new Map([...live, ...local].map(post => [post.slug, post])).values()];
  const research = JSON.parse(await readFile(new URL("docs/seo-research/seo-refresh-latest.json", root), "utf8"));
  const outputDir = new URL("artifacts/api-server/src/data/", root);
  await mkdir(outputDir, { recursive: true });
  const posts: unknown[] = [];
  // Two bounded generation lanes; completed articles are checkpoints, not regenerated on resume.
  for (let start = 0; start < topics.length; start += 2) {
    const results = await Promise.all(topics.slice(start, start + 2).map(async topic => {
      const checkpoint = new URL(`.local/seo-refresh-${topic.slug}.json`, root);
      try {
        const cached = JSON.parse(await readFile(checkpoint, "utf8"));
        console.log(`Reusing reviewed checkpoint: ${topic.slug}`);
        return cached;
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
      }
      if (existing.some(post => post.primaryKeyword.toLowerCase() === topic.keyword.toLowerCase()))
        throw new Error(`Keyword already covered: ${topic.keyword}`);
      const visual = journalImagery[topic.slug];
      if (!visual) throw new Error(`No approved unique cover: ${topic.slug}`);
      const context = { existing, engagement: [], keywordResearch: research };
      const draftPath = new URL(`.local/seo-draft-${topic.slug}.json`, root);
      let rejected;
      try {
        rejected = { raw: JSON.parse(await readFile(draftPath, "utf8")), issues: await readFile(draftPath.pathname + ".review.txt", "utf8") };
      } catch (err) { if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err; }
      const post = process.argv.includes("--review-drafts") ? await reviewPreparedDraft(JSON.parse(await readFile(draftPath, "utf8")), context, topic)
        : rejected ? await repairDraftAfterReview(validateArticle(rejected.raw, existing), context, topic, rejected.issues)
        : await createBlueprintArticle(topic, context, undefined, {
        slug: topic.slug, draftPath: new URL(`.local/seo-draft-${topic.slug}.json`, root).pathname,
        image: { url: visual.imageUrl, alt: visual.imageAlt, creditHtml: `<p><em>${visual.caption}</em></p>` },
      });
      await writeFile(checkpoint, JSON.stringify(post, null, 2));
      console.log(`Reviewed ${post.slug}: ${post.wordCount} words`);
      return post;
    }));
    posts.push(...results);
  }
  await writeFile(new URL("seo-refresh-2026-10.json", outputDir), JSON.stringify(posts, null, 2));
  console.log(`Prepared ${posts.length} reviewed articles; no production database writes performed.`);
} finally { await pool.end(); }
