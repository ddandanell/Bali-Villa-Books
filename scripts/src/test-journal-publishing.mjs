import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtempSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "bali-journal-policy-"));
try {
  execFileSync("pnpm", ["--filter", "@workspace/api-server", "exec", "esbuild",
    "src/lib/editorial-blueprint.ts", "src/lib/blog-policy.ts", "--bundle", "--platform=node", "--format=cjs",
    "--loader:.txt=text", `--outdir=${dir}`], { stdio: "pipe" });
  const require = createRequire(import.meta.url);
  const { blueprintTopics, nextBlueprintTopic, validateBlueprintStructure, articleFaqs } = require(join(dir, "editorial-blueprint.js"));
  const { baliClock, nextPublication, MIN_WORDS, DAILY_POSTS } = require(join(dir, "blog-policy.js"));
  assert.equal(blueprintTopics.length, 100);
  assert.equal(new Set(blueprintTopics.map(t=>t.id)).size, 100);
  assert.equal(new Set(blueprintTopics.map(t=>t.cluster)).size, 8);
  assert.equal(nextBlueprintTopic([],1).id,1);
  const priorityTopics = JSON.parse(readFileSync(new URL("../../lib/site-content/src/seo-priority-topics.json", import.meta.url)));
  assert.equal(nextBlueprintTopic([{primaryKeyword:blueprintTopics[0].keyword}]).id,priorityTopics[0].id);
  assert.equal(nextBlueprintTopic(priorityTopics.slice(0,4).map(t=>({primaryKeyword:t.keyword}))).id,205);
  assert.equal(nextBlueprintTopic([...blueprintTopics,...priorityTopics].map(t=>({primaryKeyword:t.keyword}))),undefined);
  assert.equal(nextBlueprintTopic([{primaryKeyword:priorityTopics[0].keyword.toUpperCase().replaceAll(" ","-")}]).id,priorityTopics[1].id);
  assert.equal(MIN_WORDS,1500);
  assert.equal(DAILY_POSTS,1);
  assert.equal(baliClock(new Date("2026-10-10T00:59:00Z")).eligible,false);
  assert.equal(baliClock(new Date("2026-10-10T01:00:00Z")).eligible,true);
  assert.equal(baliClock(new Date("2026-10-11T01:00:00Z")).eligible,true);
  assert.equal(nextPublication(new Date("2026-10-09T03:00:00Z"),true).toISOString(),"2026-10-10T01:00:00.000Z");
  const faqs = "<h2>Frequently asked questions</h2>"+Array.from({length:4},(_,i)=>`<h3>Question ${i+1}?</h3><p>Supported answer ${i+1}.</p>`).join("");
  const html = `<h2>Who this applies to</h2><p>Owners and managers.</p><h2>Illustrative IDR example</h2><table><tbody><tr><td>Revenue</td><td>IDR 100,000,000</td></tr></tbody></table><h2>What owners get wrong</h2><p>Three explained mistakes.</p>${faqs}<h2>Scope</h2><p>General information, not tax advice.</p>`;
  validateBlueprintStructure(html,"villa bookkeeping bali","villa bookkeeping bali");
  assert.equal(articleFaqs(html).length,4);
  assert.throws(()=>validateBlueprintStructure(html.replace("<table>","<div>"),"x","x"),/table/);
  assert.throws(()=>validateBlueprintStructure(html,"x","y"),/keyword/);
  assert.throws(()=>validateBlueprintStructure(html+"<p>The tax rate is 10%.</p>","x","x"),/review/);
  console.log("PASS: 100 topics, 8 clusters, persistent keyword coverage, daily/weekend Bali schedule, reader scope, table, FAQ extraction, disclaimer and tax-claim hold.");
} finally { rmSync(dir,{recursive:true,force:true}); }
