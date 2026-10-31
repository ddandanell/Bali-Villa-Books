# Keyword map — site-001 bali-villa-accounting-service.com

Version 1.0 · built 2026-10-31 18:40 (+08) · owner: Bali Accounting SEO (Adel)
Machine-readable twin: `docs/seo/keyword-map.json` (the publishing queue lives there).

## What this map is, and what it is not

It assigns **one primary keyword per URL** across the 31 marketing routes and clusters the 76 live journal articles. It ranks demand by **business proximity**, not by volume, because **this site has no volume source at all**:

| Source | Status |
|---|---|
| Google Search Console | not connected |
| GA4 / any analytics | not connected |
| SERP or keyword-volume provider | none connected |
| First-party events | `/api/site-events` and `/api/blog/events` are write-only POST endpoints; no read surface, no dashboard |
| Backlink data | `seo_backlinks` table empty |

Consequence, stated plainly: **no traffic, ranking, impression, click or lead figure for this site can be sourced today.** Every number in this document that looks like demand is a rank, not a measurement. Anything I report later as "working" has to come from a crawl, a link graph or a page-quality check until Search Console is verified.

## Intent tiers

| Tier | Meaning | Pages |
|---|---|---|
| T1 | transactional — hire, quote, enquire | 20 |
| T2 | commercial investigation — compare, cost, choose | 9 |
| T3 | informational with records/workflow intent | journal |
| T4 | news/regulatory — authority only | 5 journal posts |

The money path is T1 → T2 → T3 → back to T1. Every journal article must carry at least one T1 link; 71 of 76 currently do not link to `/pricing`.

## Page assignments

| URL | Primary | Secondaries | Intent |
|---|---|---|---|
| `/` | villa accounting bali | bali villa accounting · accounting firm bali | T1/T2 |
| `/services` | accounting services bali | bookkeeping and tax support bali · outsourced accounting bali | T1 |
| `/pricing` | villa bookkeeping cost bali | bookkeeping package price · monthly accounting fee bali | T2 |
| `/compare` | how to get bali villa bookkeeping done | accountant vs offshore · manager vs accountant | T2 |
| `/compare/bali-firm-vs-offshore-bookkeeper` | bali accountant vs offshore bookkeeper | offshore bookkeeper villa | T2 |
| `/compare/villa-manager-vs-specialist-bookkeeping` | villa manager bookkeeping vs accountant | management company bookkeeping bali | T2 |
| `/compare/cleanup-and-monthly-vs-monthly-only` | bookkeeping cleanup or monthly package | catch up books bali | T2 |
| `/compare/monthly-package-vs-hourly-accountant` | monthly package vs hourly accountant bali | hourly accountant bali | T2 |
| `/sample-report` | villa monthly financial report example | villa owner report sample · villa p&l example | T2 |
| `/faq` | bali villa bookkeeping questions | villa accounting faq | T2 |
| `/about` | bali accounting denpasar | english speaking accountant bali | T2 |
| `/get-started` | contact bali accountant | bookkeeping consultation bali | T1 |
| `/villa-financial-reporting-bali` | villa financial reporting bali | villa p&l bali · owner reporting bali | T1 |
| `/villa-bookkeeping-cleanup-bali` | bookkeeping cleanup bali | catch up bookkeeping bali · clean up villa books | T1 |
| `/airbnb-bookkeeping-bali` | airbnb bookkeeping bali | airbnb villa accounting · airbnb host bookkeeping indonesia | T1 |
| `/airbnb-ota-reconciliation-bali` | airbnb ota payout reconciliation bali | booking.com payout reconciliation · ota commission reconciliation | T1 |
| `/pt-pma-villa-bookkeeping` | pt pma accounting bali | pt pma bookkeeping · foreign owned company accounting bali | T1 |
| `/company-formation-bali` | pt pma company formation bali | set up a company in bali · pt pma setup | T1 |
| `/villa-payroll-records-bali` | villa payroll bali | bpjs villa staff · staff salary records bali | T1 |
| `/business-licensing-bali` | oss nib bali | business licence bali · nib registration bali | T1 |
| `/tax-registration-bali` | npwp registration bali | coretax registration · tax id indonesia company | T1 |
| `/tax-compliance-bali` | tax compliance bali | monthly tax filing villa · corporate tax return indonesia | T1 |
| `/tax-planning-bali` | tax planning bali | tax benefit review indonesia | T1 |
| `/business-visa-bali` | business visa bali | visa application support bali | T1 |
| `/company-compliance-bali` | company compliance bali | annual company reporting indonesia · laporan tahunan pma | T1 |
| `/investor-kitas-bali` | investor kitas bali | kitas application support | T1 |
| `/terms`, `/privacy` | not ranking targets | — | legal |

Money pages are **thin next to the journal**: 20 of 26 run 700–1,250 words while the average article runs 2,084. `/airbnb-ota-reconciliation-bali` (2,269) and `/sample-report` (2,422) are the only two that match the journal's depth, and they are the two most complete commercial pages on the site. That is the clearest "what works" signal available without traffic data.

## Journal clusters

| Cluster | Posts | Note |
|---|---|---|
| tax records and filings (descriptive) | 15 | deepest coverage, closest to a licensed adviser's work |
| owner reporting, cash flow, ROI | 10 | strongest fit to reader 1 |
| month-end close and reconciliation | 9 | |
| airbnb and OTA money mechanics | 8 | best commercial adjacency |
| cleanup, handover, switching accountant | 7 | |
| payroll, invoices, petty cash | 6 | |
| choosing and comparing providers | 6 | overlaps `/compare` |
| PT PMA entity records | 4 | thin against a whole reader persona |
| multi-property and shared cost allocation | 4 | thin against reader 2 |
| Indonesia news and visas | 5 | lowest relevance; all 5 are the posts under the 1,500-word floor |

## Cannibalisation findings

Structural evidence only — no rank data exists. Each pair shares an intent, not merely a word.

| ID | Pair | Evidence | Fix | Status |
|---|---|---|---|---|
| C1 | `/pricing` vs 3 cost articles (`bali-accountant-cost`, `monthly-bookkeeping-cost-villa-deliverables`, `outsource-accounting-bali-villa-cost-comparison`) | all four target cost language; only `/pricing` has published prices and a conversion action | differentiate: `/pricing` owns the transactional price query | open |
| C2 | `/villa-bookkeeping-cleanup-bali` vs `/blog/bookkeeping-cleanup-bali` | **exact duplicate primary keyword** | differentiate; journal keeps a records/process angle | open |
| C3 | `/` vs `/blog/bali-villa-accounting-service` | the 2,457-word post restates the firm's own service and competes for the head term | post moves to a first-90-days angle | open |
| C4 | `bali-villa-supplier-invoice-payroll-control-calendar` vs `bali-villa-payroll-supplier-invoice-control-workflow` | 0.75 title/H1 token overlap, same workflow | merge, redirect the weaker slug | open |
| C5 | `pph-final-rental-income-bali-records` vs `bali-villa-rental-income-tax-foreign-owner-records` | 0.55 overlap, same records list | differentiate by viewpoint in the titles | open |
| C6 | `rental-property-bookkeeping-owner-contributions` vs `…-refundable-deposits-owner-statements` | 0.5 overlap, both owner money movements | differentiate: contribution vs deposit | open |

**Blocker on C1–C6:** every one of those URLs except `/pricing` and `/villa-bookkeeping-cleanup-bali` is an origin-owned journal record with **no write API**. Titles and primaries can only change two ways — the Replit repair SQL, or a fifth edge transform in `api/gateway.mjs`. Both are decisions, not patches, and I am not taking either without a decision.

## Publishing queue

Twenty entries, in order, in `keyword-map.json`. First five: annual corporate tax return file for a PT PMA · pre-opening costs and the first twelve months · BPJS for villa staff · what the books must show before you buy · PPN and the management company invoice.

Rules a new article must satisfy before drafting: one primary not already owned by a money page; a named page it will not cannibalise; three named link targets; house structure and length; no tax, legal or immigration conclusion.

## What would change this map

Verifying Search Console turns tiers into impressions and this becomes a real demand map. Until then it is a coverage and cannibalisation map, and I will describe it as one.
