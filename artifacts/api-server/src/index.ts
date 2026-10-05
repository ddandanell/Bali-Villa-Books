import app from "./app";
import { logger } from "./lib/logger";
import { startBlogAutomation, seedBlogPosts } from "./routes/blog";
import { startEnquiryRetention } from "./routes/enquiries";
import { applyBlueprintGuideUpdates } from "./lib/blueprint-guides";
import { publishResearchedNews } from "./lib/researched-news";

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
  void seedBlogPosts().then(applyBlueprintGuideUpdates).then(publishResearchedNews).then(startBlogAutomation).catch(err => logger.error({ err }, "Blog initialization failed"));
});
