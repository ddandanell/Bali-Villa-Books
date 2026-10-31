import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const directory = mkdtempSync(join(tmpdir(), "villa-editorial-research-"));
try {
  execFileSync("pnpm", ["--filter", "@workspace/api-server", "exec", "esbuild", "src/lib/editorial-research.ts",
    "--bundle", "--platform=node", "--format=cjs", `--outfile=${join(directory, "research.cjs")}`], { stdio: "pipe" });
  const require = createRequire(import.meta.url);
  const { extractResearchHeadings, collectEditorialResearch, intentAlreadyCovered, mergeEditorialMetadata } = require(join(directory, "research.cjs"));
  assert.deepEqual(extractResearchHeadings('<nav><h2>Misleading navigation headline</h2></nav><h2>Documented bookkeeping controls</h2><script><h2>Injected source instructions</h2></script>'), ["Documented bookkeeping controls"]);
  assert.equal(intentAlreadyCovered({ keyword: "chargeback records villa", workingTitle: "Villa card dispute records checklist" }, [{ primaryKeyword: "CHARGEBACK-RECORDS-VILLA", title: "Another label" }]), true);
  assert.equal(intentAlreadyCovered({ keyword: "chargeback records villa", workingTitle: "Villa card dispute records checklist" }, [{ primaryKeyword: "refunds", title: "Owner funding records" }]), false);
  const previous = { attempts: 2, editorial: { selection: { id: 12 }, stage: "drafting" } };
  const merged = mergeEditorialMetadata(previous, { stage: "held", reason: "source unavailable" });
  assert.deepEqual(merged.editorial.selection, { id: 12 });
  assert.equal(merged.attempts, 2);
  assert.equal(previous.editorial.stage, "drafting");
  let active = 0, maximum = 0;
  const fetcher = async (url, options) => {
    assert.equal(new URL(url).protocol, "https:");
    assert.equal(options.redirect, "error");
    active++; maximum = Math.max(maximum, active);
    await new Promise(resolve => setTimeout(resolve, 1));
    active--;
    if (url.includes("pajak")) return new Response("Unavailable", { status: 503 });
    return new Response("<h2>A genuinely useful client question</h2>", { headers: { "content-type": "text/html" } });
  };
  const first = await collectEditorialResearch({ fetcher, at: new Date("2026-10-31T01:00:00Z") });
  assert.ok(maximum <= 2);
  assert.equal(first.observations.find(source => source.sourceId === "djp").state, "unavailable");
  assert.equal(first.observations.find(source => source.sourceId === "djp").reason, "HTTP 503");
  const second = await collectEditorialResearch({ fetcher, previous: first.observations });
  assert.equal(second.observations.find(source => source.sourceId === "emerhub").changedSinceLastObservation, false);
  assert.ok(first.limitations.some(limit => /not verified rules/.test(limit)));
  console.log("PASS: source failures stay unknown, discovery is bounded, nav/script text is excluded, keyword variants deduplicate and failed-run evidence survives metadata updates.");
} finally { rmSync(directory, { recursive: true, force: true }); }
