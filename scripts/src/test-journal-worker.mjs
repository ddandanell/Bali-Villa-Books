import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { validateWorkerEnvironment, verifyBundle } from "../../tools/journal-worker/worker.mjs";

const fixture = {
  JOURNAL_WORKER_ENVIRONMENT: "production",
  JOURNAL_PRODUCTION_DATABASE_URL: "postgresql://fixture:fixture@database.invalid/main",
  AI_INTEGRATIONS_OPENAI_API_KEY: "non-secret-test-fixture",
  AI_INTEGRATIONS_OPENAI_BASE_URL: "https://ai.invalid/v1",
};
assert.equal(validateWorkerEnvironment(fixture), true);
assert.throws(() => validateWorkerEnvironment({ ...fixture, JOURNAL_WORKER_ENVIRONMENT: "development" }), /production explicitly/);
assert.throws(() => validateWorkerEnvironment({ ...fixture, JOURNAL_PRODUCTION_DATABASE_URL: "", DATABASE_URL: fixture.JOURNAL_PRODUCTION_DATABASE_URL }), /JOURNAL_PRODUCTION_DATABASE_URL/);
assert.throws(() => validateWorkerEnvironment({ ...fixture, JOURNAL_PRODUCTION_DATABASE_URL: "https://database.invalid" }), /PostgreSQL/);
assert.throws(() => validateWorkerEnvironment({ ...fixture, AI_INTEGRATIONS_OPENAI_BASE_URL: "http://ai.invalid" }), /HTTPS/);
const folder = await mkdtemp(path.join(os.tmpdir(), "journal-worker-test-"));
try {
  await mkdir(path.join(folder, "payload"));
  const contents = "export const fixture = true;";
  await writeFile(path.join(folder, "payload/run-blog-job.mjs"), contents);
  await writeFile(path.join(folder, "bundle-manifest.json"), JSON.stringify({ files: { "run-blog-job.mjs": createHash("sha256").update(contents).digest("hex") } }));
  await verifyBundle(folder);
  await writeFile(path.join(folder, "payload/run-blog-job.mjs"), "changed");
  await assert.rejects(() => verifyBundle(folder), /integrity/);
  await writeFile(path.join(folder, "bundle-manifest.json"), JSON.stringify({ files: { "../run-blog-job.mjs": "bad", "run-blog-job.mjs": "bad" } }));
  await assert.rejects(() => verifyBundle(folder), /Unsafe/);
} finally {
  await rm(folder, { recursive: true, force: true });
}
const automation = await readFile(new URL("../../artifacts/api-server/src/lib/blog-automation.ts", import.meta.url), "utf8");
assert.ok(automation.includes('JOURNAL_SCHEDULER_MODE === "external"'));
assert.ok(automation.includes('return "busy"'));
assert.ok(automation.includes("for (const slot of"));
assert.ok(automation.includes("pg_advisory_xact_lock(74192833)"));
assert.ok(automation.includes("attempts >= 4"));
console.log("PASS: production-only explicit database, no fallback, secure AI endpoint, bundle integrity, external timer mode and bounded worker retries; no network or generation used.");
