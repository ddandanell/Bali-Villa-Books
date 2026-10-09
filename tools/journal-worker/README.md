# Bali Accounting — independent daily Journal worker

This is a standalone **Scheduled** deployment, not another web server.
Keep the main website on **Autoscale**. Do not change the website's deployment
type to Scheduled or import its artifact manifests into this worker project.

## Activate once

1. Export the package in the main project:
   `node scripts/src/export-journal-worker.mjs`.
   Download `exports/journal-worker.zip` from Files and import its contents as
   the root of a **separate, private Node.js Replit project** (Node 24 or later).
2. In that worker project's Secrets, add
   **JOURNAL_PRODUCTION_DATABASE_URL** using the main website's **production**
   connection string from Database → Production → Settings.
   Never use the development URL, never paste it into chat, and do not rely
   on a new worker project's own database.
3. Add the Replit OpenAI AI integration to the worker project. It must provide
   **AI_INTEGRATIONS_OPENAI_API_KEY** and **AI_INTEGRATIONS_OPENAI_BASE_URL**.
   Provision this integration in the worker project rather than copying keys
   into code. Add the non-secret environment setting
   **JOURNAL_WORKER_ENVIRONMENT=production** there as well.
4. Publish the main website update first. The worker's read-only database
   preflight checks that the first blueprint article and automation tables exist.
   Run `node worker.mjs --check` in the worker project; it performs no generation
   and no database writes.
5. In the worker project's Publishing settings, select **Scheduled**:
   - Schedule: `0,15,30,45 9 * * *`
   - Time zone: **Asia/Makassar** (Bali, UTC+8)
   - Run command: `node worker.mjs`
   - Build command: `node worker.mjs --offline-check`
   - Job timeout: allow up to **30 minutes** for generation and weekly review.
   - Enable failure alerts.
   Then publish the worker and verify its first successful run in Publishing logs.

The package intentionally contains no `.replit` or artifact manifests. Set the
worker's build/run commands in its own Publishing settings; never replace the
main website's configuration with worker configuration.

The 09:00 run creates that day's two articles. The 09:15, 09:30 and 09:45 runs
are bounded recovery checks, not extra articles: completed slots are skipped
without another generation. A failed slot gets at most four scheduled attempts.
An active competing publisher or an incomplete exhausted run exits non-zero so
the scheduler can alert instead of reporting false success.

## Commands and safety

- `node worker.mjs --offline-check`: verifies bundled file hashes only;
  explicitly does not claim the database, AI integration or schedule works.
- `node worker.mjs --check`: verifies environment, bundle and the expected
  Journal database, without generating or writing posts.
- `node worker.mjs`: publishes eligible slots and performs the weekly review.

The worker uses the same persistent queue, publication keys and PostgreSQL
advisory lock as the website. It doesn't serve HTTP, need a public URL, call
the sleeping website, run migrations, create a replacement database, or seed
customer data. Secrets are never included in the exported package.

The website should have **JOURNAL_SCHEDULER_MODE=external** in its production
environment once this worker is configured. That disables the website's
in-process timer after republishing, avoiding competing executions.

Publishing this website alone does **not** activate the independent schedule.
After changes to the publisher or blueprint, export an updated bundle and
republish the worker too. Article records remain in the shared production
database, so redeployment does not reset the topic queue.
