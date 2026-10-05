import { runBlogAutomation } from "./lib/blog-automation";
import { pool } from "@workspace/db";
import { logger } from "./lib/logger";

try {
  await runBlogAutomation();
} catch (err) {
  logger.error({ err }, "Content publishing command failed");
  process.exitCode = 1;
} finally {
  await pool.end();
}
