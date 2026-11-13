# Weekly technical SEO maintenance

## What this change does

- One article service-owner assignment is used by the current React UI and backend renderer. The Vercel gateway adds the same link to existing upstream initial HTML until that backend is rebuilt. Existing keyword assignments and images are unchanged.
- Clarifies monthly bookkeeping exclusions versus separately scoped in-house services.
- Removes unconfirmed schema opening hours. Marketing sitemap dates are omitted rather than reset to every build date; real article modification dates remain.
- Adds a contextual comparison link on pricing.
- Adds `@vercel/analytics` 2.x production-only tracking, with query/hash removal and public-path filtering. Existing Umami and first-party event contracts remain. Contact clicks are not completed leads; enquiry submission is tracked only after the save succeeds.

## Measurement state on 13 November 2026

The connected project reports Web Analytics enabled. A production page-view metrics query over the previous seven days returned empty rows, not proof of zero visitors. This PR adds missing site-side instrumentation; collection is unverified until deployed and visited. No paid analytics upgrade is requested.

## Weekly schedule

The proposed `docs/seo/weekly-seo.workflow.yml` must first be added as `.github/workflows/weekly-seo.yml` by a user with workflow-write access. This connection cannot publish files under `.github/workflows` (GitHub rejected that attempt; nothing was published). Once installed, it runs Mondays at **09:17 Asia/Makassar** (01:17 UTC), subject to GitHub schedule delays, on the default branch. It also supports manual dispatch. It starts only after installing the workflow on the default branch and with GitHub Actions enabled.

The read-only crawler inventories all three public sitemaps and follows internal page links, including archive pagination. It checks HTTP responses, redirects, titles, descriptions, canonicals, H1s, noindex directives, JSON-LD syntax, generic anchors and reachability. It follows only same-origin public routes, with timeouts and bounded inventory sizes. A partial read is marked incomplete and fails the job; defects also fail the job. Findings and evidence are retained as a GitHub Actions artifact and job summary for 90 days. This is not a rendered-browser, image-availability, keyword-volume or Core Web Vitals test.

## Boundaries and remaining activation

**This workflow is a weekly audit, not a fully autonomous AI optimizer.** It cannot use this chat's credentials or execute an assistant after the turn. No Vercel token is copied into GitHub, the repository or job logs. The proposed workflow has read-only repository permissions and does not publish articles, rewrite titles, open PRs, auto-merge, or deploy.

The existing `seo-autopilot.json` and `docs/seo/autopilot.md` describe an external Monday/Thursday editorial runner. Its live scheduling state was not verifiable with the tools available for this change. That configuration is preserved; no competing publisher is added and no claim is made that the external runner was activated or altered.

To close the loop, a recurring coding runner must have durable authorized repository and analytics access. It should read this week's crawl artifact, compare 7/28-day page views and appropriate engagement events, inspect Google Search Console data when separately connected, prioritize supported changes, and validate them through PR checks and preview verification. Do not use clicks as sales, traffic as rankings, or sparse samples as proof of improvement. Missing measurements must remain explicit. Search Console is not connected by this PR.

Retain stable article keyword ownership, service boundaries, prices, factual qualifications and existing approved images. Do not mechanically pad legal pages or promise ranking improvements. Review existing canonical-link PR #32 rather than duplicating its changes.

## Verification

Run on Node 24:

```sh
pnpm install --frozen-lockfile
node scripts/src/test-weekly-seo.mjs
pnpm check
```

A connected GitHub runner can perform the public crawl with:

```sh
node scripts/src/weekly-seo.mjs
```

Ordinary sandbox egress cannot reach production deployment URLs, so unit fixtures and source/build checks are not represented as a successful production crawl. The first scheduled/manual job is a separate verification step after merge.
