import { readFile, writeFile, mkdir } from "node:fs/promises";
import { db, pool, blogPosts } from "@workspace/db";
import { createBlueprintArticle, repairDraftAfterReview, reviewPreparedDraft } from "../lib/journal-writer";
import { validateArticle, repairArticleLinks } from "../lib/blog-content";
import { journalImagery } from "@workspace/site-content";
import type { BlueprintTopic } from "../lib/editorial-blueprint";
import { validateBlueprintStructure } from "../lib/editorial-blueprint";

// This utility is bundled into artifacts/api-server/dist before execution.
const root = new URL("../../../", import.meta.url);
const campaign = process.argv.find(arg => arg.startsWith("--campaign="))?.split("=")[1];
if (campaign && !/^\d{4}-\d{2}-\d{2}$/.test(campaign)) throw new Error("Invalid campaign date");
try {
  const topics: (BlueprintTopic & { slug: string })[] = JSON.parse(await readFile(new URL(campaign ? `.local/seo-expansion-${campaign}-topics.json` : ".local/seo-refresh-topics.json", root), "utf8"));
  const local = await db.select({ slug: blogPosts.slug, title: blogPosts.title, primaryKeyword: blogPosts.primaryKeyword, imageUrl: blogPosts.imageUrl }).from(blogPosts);
  const live: typeof local = [];
  for (let offset = 0; offset < 1000; offset += 50) {
    const response = await fetch(`https://bali-villa-accounting-service.com/api/blog/posts?limit=50&offset=${offset}`);
    if (!response.ok) throw new Error("Cannot check production article coverage");
    const page = await response.json() as typeof local;
    live.push(...page);
    if (page.length < 50) break;
    if (offset === 950) throw new Error("Inventory exceeds this campaign's safety limit");
  }
  const safeLocal = local.filter(post => live.some(p => p.slug === post.slug) || topics.some(t => t.slug === post.slug));
  const existing = [...new Map([...live, ...safeLocal].map(post => [post.slug, post])).values()];
  const research = JSON.parse(await readFile(new URL(campaign ? `docs/seo-research/seo-expansion-${campaign}-research.json` : "docs/seo-research/seo-refresh-latest.json", root), "utf8"));
  const outputDir = new URL("artifacts/api-server/src/data/", root);
  await mkdir(outputDir, { recursive: true });
  const posts: unknown[] = [];
  const held: string[] = [];
  const lanes = process.argv.includes("--sequential") ? 1 : 2;
  // Two bounded generation lanes; completed articles are checkpoints, not regenerated on resume.
  for (let start = 0; start < topics.length; start += lanes) {
    const results = await Promise.allSettled(topics.slice(start, start + lanes).map(async topic => {
      const checkpoint = new URL(`.local/seo-refresh-${topic.slug}.json`, root);
      try {
        const cached = JSON.parse(await readFile(checkpoint, "utf8"));
        cached.contentHtml = repairArticleLinks(cached.contentHtml, existing);
        const siblings = new Set([...cached.contentHtml.matchAll(/href="\/blog\/([^"]+)"/g)].map((match: RegExpMatchArray) => match[1]));
        if (siblings.size < 2) {
          const terms = new Set(topic.keyword.split(" ").filter(word => word.length > 3));
          const score = (post: typeof existing[number]) => `${post.title} ${post.primaryKeyword}`.toLowerCase().split(/\W+/).filter(word => terms.has(word)).length;
          const related = existing.filter(post => post.slug !== topic.slug).sort((a, b) => score(b) - score(a)).slice(0, 2);
          cached.contentHtml += "<p>Related reading: " + related.map(post => `<a href="/blog/${post.slug}">${post.title.replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</a>`).join("; ") + ".</p>";
        }
        const checked = validateArticle(cached, existing.filter(post => post.slug !== topic.slug));
        validateBlueprintStructure(checked.contentHtml, topic.keyword, checked.primaryKeyword);
        if (checked.wordCount > 2500) throw new Error("Reviewed checkpoint exceeds word limit after link repair");
        await writeFile(checkpoint, JSON.stringify(checked, null, 2));
        console.log(`Reusing reviewed checkpoint: ${topic.slug}`);
        return checked;
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
      }
      if (existing.some(post => post.primaryKeyword.toLowerCase() === topic.keyword.toLowerCase()))
        throw new Error(`Keyword already covered: ${topic.keyword}`);
      const visual = journalImagery[topic.slug];
      if (!visual) throw new Error(`No approved unique cover: ${topic.slug}`);
      const terms = topic.keyword.toLowerCase().split(/\W+/).filter(word => word.length > 3);
      const focusedResearch = campaign ? {
        checkedAt: research.checkedAt, keywordSnapshotDate: research.keywordSnapshotDate,
        apiAccess: research.apiAccess, limitations: research.limitations,
        rows: (research.rows ?? []).filter((row: { keyword: string }) => terms.some(word => row.keyword.includes(word)))
          .slice(0, 20).map((row: { keyword: string; market: string; searchVolume: number | null }) => ({ keyword: row.keyword, market: row.market, estimatedMonthlySearches: row.searchVolume })),
        publicSearch: (research.publicSearch?.resultPages ?? []).map((page: { title: string; url: string }) => ({ title: page.title, url: page.url })),
      } : research;
      const context = { existing, engagement: [], keywordResearch: focusedResearch };
      const draftPath = new URL(`.local/seo-draft-${topic.slug}.json`, root);
      let rejected;
      try {
        rejected = { raw: JSON.parse(await readFile(draftPath, "utf8")), issues: await readFile(draftPath.pathname + ".review.txt", "utf8") };
      } catch (err) { if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err; }
      const post = process.argv.includes("--review-drafts") || process.argv.includes(`--prepared=${topic.slug}`) ? await reviewPreparedDraft(JSON.parse(await readFile(draftPath, "utf8")), context, topic)
        : rejected ? await repairDraftAfterReview(validateArticle(rejected.raw, existing), context, topic, rejected.issues)
        : await createBlueprintArticle(topic, context, undefined, {
        slug: topic.slug, draftPath: new URL(`.local/seo-draft-${topic.slug}.json`, root).pathname,
        image: { url: visual.imageUrl, alt: visual.imageAlt, creditHtml: `<p><em>${visual.caption}</em></p>` },
      });
      await writeFile(checkpoint, JSON.stringify(post, null, 2));
      console.log(`Reviewed ${post.slug}: ${post.wordCount} words`);
      return post;
    }));
    for (const result of results) {
      if (result.status === "fulfilled") posts.push(result.value);
      else { held.push(String(result.reason?.message ?? result.reason)); console.error("Article held:", held.at(-1)); }
    }
  }
  if (held.length) throw new Error(`${held.length} article(s) held; ${posts.length} completed articles checkpointed. ${held.join("; ")}`);
  await writeFile(new URL(campaign ? `seo-expansion-${campaign}.json` : "seo-refresh-2026-10.json", outputDir), JSON.stringify(posts, null, 2));
  console.log(`Prepared ${posts.length} reviewed articles; no production database writes performed.`);
} catch (error) {
  const err = error as { message?: string; status?: number; code?: string; headers?: Headers };
  console.error(JSON.stringify({ message: err.message, status: err.status, code: err.code,
    retryAfter: err.headers?.get?.("retry-after"), requestLimit: err.headers?.get?.("x-ratelimit-limit-requests"),
    tokensRemaining: err.headers?.get?.("x-ratelimit-remaining-tokens") }));
  process.exitCode = 1;
} finally { await pool.end(); }
