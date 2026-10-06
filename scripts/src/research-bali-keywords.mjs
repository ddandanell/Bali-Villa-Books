import { mkdir, writeFile } from "node:fs/promises";
import { dataforseoRequest } from "./dataforseo-client.mjs";

const markets = ["Indonesia", "Australia", "United Kingdom", "United States"];
const seeds = [
  "accounting bali", "bali accounting", "accountant bali", "accountants bali",
  "accounting services bali", "bookkeeping bali", "bali bookkeeping",
  "bookkeeping services bali", "bookkeeper bali", "accounting services denpasar",
  "bookkeeping services denpasar", "accountant denpasar", "villa accounting bali",
  "bali villa accounting", "villa bookkeeping bali", "bali villa bookkeeping",
  "villa bookkeeping services", "villa accounting services", "villa financial reporting",
  "villa financial reporting bali", "monthly villa financial report", "villa owner reports",
  "villa cash flow", "villa profit and loss", "villa accounting report",
  "airbnb bookkeeping", "airbnb accounting", "airbnb bookkeeping bali",
  "airbnb accounting bali", "airbnb payout reconciliation", "booking com reconciliation",
  "ota reconciliation", "ota payout reconciliation", "short term rental bookkeeping",
  "short term rental accounting", "vacation rental bookkeeping", "vacation rental accounting",
  "rental property bookkeeping", "rental property accounting", "property management bookkeeping",
  "bookkeeping cleanup", "catch up bookkeeping", "bookkeeping cleanup bali",
  "villa bookkeeping cleanup bali", "historical bookkeeping cleanup",
  "pt pma accounting", "pt pma bookkeeping", "pt pma accounting bali",
  "pt pma villa bookkeeping", "pma accounting indonesia", "foreign owned company bookkeeping",
  "payroll bali", "payroll services bali", "villa payroll", "bpjs payroll",
  "villa payroll records", "bookkeeping prices bali", "accounting fees bali",
  "bookkeeping cost bali", "bookkeeping packages bali", "monthly bookkeeping cost",
  "bali accountant for foreigners", "bali villa accounting services",
  "bali villa bookkeeping checklist", "how to reconcile airbnb payouts",
  "villa monthly report template", "villa financial report example", "villa occupancy rate",
  "villa adr", "villa revpar", "villa cash flow forecast",
  "bali visa", "indonesia visa", "digital nomad visa bali", "indonesia remote worker visa",
  "indonesia visa free countries", "bali foreign investment", "oss indonesia",
  "indonesia foreign worker permit", "indonesia emergency visa extension",
];
const rows = [];
const calls = [];
await mkdir("docs/seo-research", { recursive: true });
const record = (market, keyword, info, source) => ({
  market, language: "en", keyword, searchVolume: info?.search_volume ?? null,
  competition: info?.competition ?? null, competitionLevel: info?.competition_level ?? null,
  cpc: info?.cpc ?? null, monthlySearches: info?.monthly_searches ?? [],
  source, checkedAt: new Date().toISOString(),
});
// Deliberately sequential, capped batches. No retries that could duplicate paid work.
for (const market of markets) {
  const result = await dataforseoRequest("keywords_data/google_ads/search_volume/live", [
    { location_name: market, language_code: "en", keywords: seeds },
  ]);
  calls.push({ endpoint: "google_ads/search_volume/live", market, cost: result.cost });
  for (const task of result.tasks) for (const item of task.result ?? []) {
    rows.push(record(market, item.keyword, item, "DataForSEO Google Ads search volume"));
  }
  console.log(`${market}: volume research complete; cost ${result.cost}`);
}
for (const keyword of ["accounting bali", "bookkeeping bali", "airbnb bookkeeping", "villa accounting"]) {
  const result = await dataforseoRequest("dataforseo_labs/google/keyword_suggestions/live", [
    { keyword, location_name: "Indonesia", language_code: "en", limit: 60, include_seed_keyword: true },
  ]);
  calls.push({ endpoint: "google/keyword_suggestions/live", keyword, market: "Indonesia", cost: result.cost });
  for (const task of result.tasks) for (const group of task.result ?? []) {
    for (const item of group.items ?? []) {
      rows.push(record("Indonesia", item.keyword, item.keyword_info, "DataForSEO Labs suggestions"));
    }
  }
  console.log(`${keyword}: suggestions complete; cost ${result.cost}`);
}
const unique = [...new Map(rows.map(row => [`${row.market}:${row.keyword}`, row])).values()];
const report = {
  checkedAt: new Date().toISOString(), markets, language: "en", calls,
  totalCostUsd: calls.reduce((sum, call) => sum + Number(call.cost ?? 0), 0), rows: unique,
  limitations: [
    "Volumes are provider estimates for a specific location and language, not website traffic.",
    "Null means unavailable, not zero. Broad searches may have irrelevant intent.",
    "Advertising competition is not organic ranking difficulty.",
    "Country volumes are not summed into a claimed global market size; keyword variants may overlap.",
    "No rankings, conversion rates, traffic gains or results are guaranteed.",
  ],
};
await writeFile("docs/seo-research/dataforseo-keywords.json", JSON.stringify(report, null, 2));
const csv = [
  ["keyword", "market", "language", "estimated_monthly_searches", "ad_competition", "cpc", "source", "checked_at"],
  ...unique.map(r => [r.keyword, r.market, r.language, r.searchVolume, r.competitionLevel ?? r.competition, r.cpc, r.source, r.checkedAt]),
].map(row => row.map(v => `"${String(v ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
await writeFile("docs/seo-research/dataforseo-keywords.csv", csv);
console.log(JSON.stringify({ uniqueRows: unique.length, totalCostUsd: report.totalCostUsd, positiveVolumeRows: unique.filter(r => r.searchVolume > 0).length }));
