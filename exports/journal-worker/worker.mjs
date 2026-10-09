import { readFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));

export function validateWorkerEnvironment(env) {
  if (env.JOURNAL_WORKER_ENVIRONMENT !== "production") {
    throw new Error("Set JOURNAL_WORKER_ENVIRONMENT=production explicitly in this worker project");
  }
  const required = ["JOURNAL_PRODUCTION_DATABASE_URL", "AI_INTEGRATIONS_OPENAI_API_KEY", "AI_INTEGRATIONS_OPENAI_BASE_URL"];
  const missing = required.filter(key => !env[key]?.trim());
  if (missing.length) throw new Error(`Missing worker secrets: ${missing.join(", ")}. Add them in this worker project's Secrets, never in chat.`);
  let database;
  let ai;
  try {
    database = new URL(env.JOURNAL_PRODUCTION_DATABASE_URL);
    ai = new URL(env.AI_INTEGRATIONS_OPENAI_BASE_URL);
  } catch {
    throw new Error("A worker connection URL is invalid; check it securely in Secrets");
  }
  if (!["postgres:", "postgresql:"].includes(database.protocol)) throw new Error("The worker requires the main website's production PostgreSQL connection");
  if (ai.protocol !== "https:") throw new Error("The AI integration must use HTTPS");
  // Never fall back to this new project's own development database.
  return true;
}

export async function verifyBundle(directory = root) {
  const manifest = JSON.parse(await readFile(path.join(directory, "bundle-manifest.json"), "utf8"));
  if (!manifest.files || !Object.hasOwn(manifest.files, "run-blog-job.mjs")) throw new Error("Publisher bundle is missing");
  for (const [name, expected] of Object.entries(manifest.files)) {
    if (!/^[a-z][a-z0-9-]*\.mjs$/.test(name)) throw new Error("Unsafe bundle filename");
    const file = path.join(directory, "payload", name);
    await access(file);
    const actual = createHash("sha256").update(await readFile(file)).digest("hex");
    if (actual !== expected) throw new Error(`Publisher bundle integrity check failed: ${name}`);
  }
}

async function main() {
  const flags = process.argv.slice(2);
  if (flags.some(flag => !["--check", "--offline-check"].includes(flag)) || flags.length > 1) {
    throw new Error("Use no arguments to publish, --check for database preflight, or --offline-check for bundle integrity");
  }
  await verifyBundle();
  if (flags.includes("--offline-check")) {
    console.log("Worker bundle verified. Production database, AI access and scheduled activation have NOT been checked.");
    return;
  }
  validateWorkerEnvironment(process.env);
  process.env.DATABASE_URL = process.env.JOURNAL_PRODUCTION_DATABASE_URL;
  process.env.NODE_ENV = "production";
  if (!flags.includes("--check")) process.argv.push("--scheduled");
  await import(pathToFileURL(path.join(root, "payload/run-blog-job.mjs")).href);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(() => {
    // Connection errors can carry URLs or provider headers. Do not print them.
    console.error("Worker startup failed. Check the bundle, production-only environment flag and required Secrets; no credentials were logged.");
    process.exitCode = 1;
  });
}
