import app from "./app";
import { seedSeoRefreshArticles } from "./lib/seo-refresh-seed";
import { applyJournalClusterUpdates } from "./lib/journal-cluster-updates";
import { logger } from "./lib/logger";
import { startBlogAutomation, seedBlogPosts } from "./routes/blog";
import { startEnquiryRetention } from "./routes/enquiries";
import { applyBlueprintGuideUpdates } from "./lib/blueprint-guides";
import { publishResearchedNews } from "./lib/researched-news";
import { applySeoEditorialUpdates } from "./lib/seo-editorial-updates";
import { seedBlueprintLaunchArticle } from "./lib/blueprint-launch";
import { applyJournalImageryUpdates } from "./lib/journal-imagery-updates";
import { applyJournalRecordRepairs } from "./lib/journal-record-repairs";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
  startEnquiryRetention();
  void seedBlogPosts().then(seedSeoRefreshArticles).then(applyBlueprintGuideUpdates).then(publishResearchedNews).then(applySeoEditorialUpdates).then(seedBlueprintLaunchArticle).then(applyJournalImageryUpdates).then(applyJournalClusterUpdates).then(applyJournalRecordRepairs).then(startBlogAutomation).catch(err => logger.error({ err }, "Blog initialization failed"));
});
