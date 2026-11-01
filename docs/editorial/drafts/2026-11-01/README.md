# Journal draft: 1 November 2026

**Airbnb Co-Host Payouts: Reconcile the Owner's Share**

Status: draft, held for review. Nothing in this folder is registered with the publisher, inserted into a database or represented as live.

- Service owner: https://bali-villa-accounting-service.com/airbnb-bookkeeping-bali
- Reader question: how to connect one booking to separate owner and co-host receipts without counting an obligation twice.
- Primary keyword: `airbnb co host payout reconciliation`. Exact volume is unknown. Retained demand snapshots are dated 23 October 2026.
- Original contribution: a fixed-allocation IDR cash bridge, cross-month receipt schedule, difference decision aid and eight-step handover checklist.
- Article length: 1,906 words using the existing repository word counter; five visible FAQs.

## Files

- [Article HTML](article.html) and [article JSON](article.json)
- [Research and source dates](research.json)
- [Persistent daily knowledge/run record](run-record.json)
- [Complete inventory used for duplicate screening](inventory.json)
- [Deterministic validation](validation.json) and [reproducible check](validate-draft.mjs)
- [Internal link checks](link-checks.json), [static article route checks](static-route-checks.json), and [image provenance](media.json)

## Evidence and intent

Airbnb's first-party help pages describe co-host allocations, payout routing, account visibility, regional limitations and earnings reports. They were checked on 1 November. Their retrieved text did not display publication/effective dates; this is a practical records guide, not a new-policy announcement or Indonesian legal advice. The article avoids fixed interface navigation, actual fee rates and payout timing promises.

Duplicate checks cover all 78 API posts in two pages, two additional live static articles, the article alias, both current topic queues, the prior chargeback sample and open/daily PR searches. The three closest existing guides were read in full and did not discuss co-host or split-payout evidence. This is a narrowly reviewed gap, not a claim that no competitor covers the question.

## QA and remaining release gates

The existing article and blueprint validators pass, as do metadata, illustrative arithmetic, HTML/JSON identity and FAQ checks. The service, two guide links, pricing and contact destination returned HTML 200. The selected Commons calculator photograph returned JPEG 200; metadata records its author and CC BY 2.0 licence, and the photo identity was absent from the inventory and both image manifests.

**Failed gate:** the existing HTML sanitizer strips `www.airbnb.com` source links. `validateArticle` still passes its sanitized copy, so a separate citation-preservation test exposes this loss. The original HTML/JSON retain all citations. Runtime code has not been changed to bypass the restriction. This draft must remain held until a separately reviewed resolution preserves its verified citations.

Independent model/editorial review and professional review have not run. No professional review is claimed. Mobile rendering, draft canonical/indexing/schema and publication cover/share preparation also remain unrun.

`node scripts/src/check-repository.mjs` passed in full: types, regressions, API/web/SSR builds and Vercel compatibility. Existing build/audit warnings are recorded in the run record. The environment supplied Node 24.22.1 and pnpm 11.25.0, which differs from the repository's declared pnpm 10.26.1. These are application regression checks, not proof of draft release readiness.

## Operational findings

Two API posts already have 1 November publication timestamps. This run does not identify their producer or change the live cadence. Only one daily draft was created here. The repository also now serves two static journal pages outside the Replit API inventory; future screening needs both sources.

Current keyword-map notes describe no connected volume provider, while older dated provider snapshots remain in the repository. The exact keyword's volume is still unknown. Search Console and GA4 are unverified, and Vercel Web Analytics was last recorded as disabled on 31 October. No current traffic, enquiry or revenue figures were read.

Review the editorial hold on 8 November. Start any performance measurement window from the actual future publication date, with an initial 28-day checkpoint and adequate data. Keep article views, CTA clicks, organic acquisition, delivered enquiries, qualified leads and revenue separate. All lessons in the daily record are proposed and unapproved.
