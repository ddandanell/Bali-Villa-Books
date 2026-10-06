import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dataforseoRequest } from "./dataforseo-client.mjs";

const report = process.argv.includes("--ranked-only")
  ? JSON.parse(await readFile("docs/seo-research/competitor-visibility.json", "utf8"))
  : { checkedAt: new Date().toISOString(), market: "Indonesia", language: "en", device: "desktop", searches: [], domains: [], totalCostUsd: 0 };
await mkdir("docs/seo-research", { recursive: true });
for (const keyword of process.argv.includes("--ranked-only") ? [] : ["accounting bali", "bookkeeping bali", "villa accounting bali", "airbnb bookkeeping bali", "pt pma accounting bali"]) {
  const response = await dataforseoRequest("serp/google/organic/live/advanced", [
    { keyword, location_name: "Indonesia", language_code: "en", device: "desktop", depth: 10 },
  ]);
  report.totalCostUsd += Number(response.cost ?? 0);
  const results = response.tasks.flatMap(task => task.result ?? []);
  const organic = results.flatMap(result => (result.items ?? []).filter(item => item.type === "organic"))
    .map(item => ({ rank: item.rank_group, url: item.url, domain: item.domain, title: item.title, description: item.description }));
  report.searches.push({ keyword, results: organic, cost: response.cost });
  console.log(JSON.stringify({ keyword, results: organic }));
  await writeFile("docs/seo-research/competitor-visibility.json", JSON.stringify(report, null, 2));
}
const excluded = /(?:^|\.)(?:linkedin|facebook|instagram|youtube|reddit|indeed|glassdoor|tripadvisor|jobstreet|glints|jooble|rumah123|unhi|bali-villa-accounting-service)\./;
const counts = new Map();
for (const search of report.searches) for (const result of search.results) {
  const domain = result.domain?.replace(/^www\./, "");
  if (!domain || excluded.test(domain)) continue;
  counts.set(domain, (counts.get(domain) ?? 0) + 1);
}
// Select actual competing providers, not job boards matching "accounting".
const targets = ["baliaccountants.com", "baliaccountingservice.com", "villa-tax.operium.store", "businesshubasia.com"];
for (const target of targets) {
  if (report.domains.some(d => d.domain === target)) continue;
  const response = await dataforseoRequest("dataforseo_labs/google/ranked_keywords/live", [{
    target, location_name: "Indonesia", language_code: "en", item_types: ["organic"], limit: 100,
    filters: ["keyword_data.keyword", "regex", "(bali|villa|bookkeep|account|pma|payroll)"],
  }]);
  report.totalCostUsd += Number(response.cost ?? 0);
  for (const task of response.tasks) for (const result of task.result ?? []) {
    report.domains.push({
      domain: target, datasetKeywordCount: result.total_count,
      providerEstimatedMetrics: result.metrics?.organic,
      keywords: (result.items ?? []).map(item => ({
        keyword: item.keyword_data?.keyword,
        estimatedMonthlySearches: item.keyword_data?.keyword_info?.search_volume ?? null,
        rank: item.ranked_serp_element?.serp_item?.rank_group,
        url: item.ranked_serp_element?.serp_item?.url,
        previousRank: item.ranked_serp_element?.serp_item?.rank_changes?.previous_rank_absolute,
      })),
      cost: response.cost,
    });
  }
  if (!report.domains.some(d => d.domain === target)) {
    report.domains.push({ domain: target, datasetKeywordCount: null, keywords: [], coverage: "No result in this location/language dataset; rankings and traffic unknown.", cost: response.cost });
  }
  console.log(`${target}: ranked-keyword dataset checked; cost ${response.cost}`);
  await writeFile("docs/seo-research/competitor-visibility.json", JSON.stringify(report, null, 2));
}
report.limitations = [
  "Live search results are a location/language/device-specific snapshot, not a longitudinal performance history.",
  "Labs keywords come from the provider's database and may lag live search results.",
  "Estimated traffic metrics are modelled, not verified Analytics sessions, enquiries, revenue or sales.",
  "A missing dataset entry is unknown coverage, not proof that a competitor has no traffic.",
];
await writeFile("docs/seo-research/competitor-visibility.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify({ totalCostUsd: report.totalCostUsd, domains: report.domains.map(d => d.domain) }));
