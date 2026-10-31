import { spawnSync, execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

// Cache only an exactly matching working tree/runtime, not an earlier commit's
// result. CI always runs in full. Generated output and secrets are gitignored.
function fingerprint() {
  const files = execFileSync("git", ["ls-files", "-co", "--exclude-standard", "-z"], { encoding: "utf8" })
    .split("\0").filter(Boolean);
  const hash = createHash("sha256").update(process.version).update(process.platform).update(process.arch);
  for (const file of [...new Set(files)].sort()) hash.update(file).update(readFileSync(file));
  return hash.digest("hex");
}
const hasGit = spawnSync("git", ["rev-parse", "--is-inside-work-tree"], { stdio: "ignore" }).status === 0;
const before = hasGit ? fingerprint() : null;
const marker = ".cache/repository-checks.json";
if (!process.env.CI && before) {
  try {
    if (JSON.parse(readFileSync(marker, "utf8")).fingerprint === before) {
      console.log("PASS: this exact working tree and Node runtime already passed repository checks.");
      process.exit(0);
    }
  } catch {}
}
const commands = [
  ["pnpm", ["run", "typecheck"]],
  ["node", ["scripts/src/test-journal-art.mjs"]],
  ["node", ["scripts/src/test-journal-publishing.mjs"]],
  ["node", ["scripts/src/test-editorial-research.mjs"]],
  ["node", ["scripts/src/test-custom-analytics.mjs"]],
  ["node", ["scripts/src/test-seo-expansion.mjs"]],
  ["pnpm", ["--filter", "@workspace/api-server", "run", "build"]],
  ["pnpm", ["run", "build:web"]],
  ["node", ["scripts/src/test-github-deployment.mjs"]],
];
for (const [command, args] of commands) {
  console.log(`\n> ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
if (before && fingerprint() === before) {
  mkdirSync(".cache", { recursive: true });
  writeFileSync(marker, JSON.stringify({ fingerprint: before, checkedAt: new Date().toISOString() }));
}
console.log("\nPASS: repository type checks, editorial/analytics regressions, API build, clean web build and Vercel compatibility.");
