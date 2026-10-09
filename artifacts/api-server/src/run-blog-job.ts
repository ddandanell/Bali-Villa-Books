import { runBlogAutomation } from "./lib/blog-automation";
import { pool } from "@workspace/db";
import { logger } from "./lib/logger";
import { baliClock, DAILY_POSTS } from "./lib/blog-policy";

try {
  if (process.argv.includes("--check")) {
    const tables = await pool.query("SELECT to_regclass('public.blog_posts') AS posts, to_regclass('public.automation_runs') AS runs, to_regclass('public.automation_config') AS config");
    if (!tables.rows[0]?.posts || !tables.rows[0]?.runs || !tables.rows[0]?.config) throw new Error("Main Journal database tables are missing");
    const first = await pool.query("SELECT 1 FROM blog_posts WHERE slug = $1 LIMIT 1", ["bali-villa-accounting-specialist-vs-general-accountant"]);
    if (!first.rows.length) throw new Error("Publish the website with the first blueprint article before activating this worker");
    logger.info("Worker database preflight passed; no article generation or database writes performed");
  } else {
    const at = new Date();
    const firstOnly = process.argv.includes("--first");
    const scheduled = process.argv.includes("--scheduled");
    const outcome = await runBlogAutomation(at, firstOnly ? { force: true, firstOnly: true } : { scheduled });
    if (outcome === "busy") throw new Error("Another publisher holds the lock; retry at the next scheduled interval");
    if (scheduled && outcome === "completed") {
      const count = await pool.query("SELECT count(*)::int AS count FROM blog_posts WHERE automation_key LIKE $1", [`${baliClock(at).dateKey}:%`]);
      if (Number(count.rows[0]?.count ?? 0) !== DAILY_POSTS) throw new Error("Daily publication remains incomplete; check the failed run before retrying");
    }
    logger.info({ outcome }, "Content publishing command finished");
  }
} catch (err) {
  logger.error({ err }, "Content publishing command failed");
  process.exitCode = 1;
} finally {
  await pool.end();
}
