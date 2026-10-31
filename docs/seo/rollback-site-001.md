# site-001 rollback plan

Scope: bali-villa-accounting-service.com, repo `ddandanell/Bali-Villa-Books`, Vercel project `bali-villa-books-api-serverff` (`prj_R4hssmwrWpUrqAn7wgPlxTSeUbX7`).

Written 31 October 2026 after the Independent QA review of the five direct-to-main commits (`15616105`, `820df1d5`, `9bd6dd69`, `d93d599b`, `c86e6da4`). Revised twice the same day: first because the four-commit revert left a link pointing at a file the revert deletes, and again after executing the revert against head `74c7ae8` (see "Executed, not assumed" below). The second revision corrects two claims that did not survive execution.

Everything is now on `main`; there is no side branch to close. A rollback means reverting commits on `main` and letting Vercel promote the result, then checking the live URLs. Nothing is reverted by deleting a branch.

## Rollback targets

| Release | Target commit | Meaning |
|---|---|---|
| 2026-10-31 (PR #8, `2fc2731`) | `58ec00c` | Last commit before that release's change set. Reverting to it drops the five commits `9c3d3bd` … `7fab6a6`. |
| Next release on top of `74c7ae8` | `74c7ae8` | Record-only commit; safe target for anything shipped after it. |

Name the target in the release note before shipping, not during the incident.

## What must not be reverted

`15616105` — the ten internal-link repoints off the three 301s. It is a correction, not part of the publishing path. Reverting it puts ten links back onto redirects.

`640ba6f` is the last commit before the publishing path existed. Removing the path by returning to it would also remove commit 1 and the comparison cluster (`9c3d3bd`, `30e58fc`). Do not use it as a rollback target.

## Executed, not assumed

The revert below was run on a scratch branch from `74c7ae8` on 2026-10-31 and taken all the way to a green build. It does not apply cleanly, and it does not work by reverting commits alone.

```
git revert --no-commit c86e6da4 d93d599b 9bd6dd69 820df1d5
```

**Conflict 1 — `artifacts/villabooks-bali/prerender.mjs`.** Reverting `c86e6da4` collides with `9c3d3bd`, which rewrote the same sitemap and `robots.txt` block. Resolution: drop the `sitemap-journal.xml` block entirely, keep the `sitemap-pages.xml` block as `9c3d3bd` wrote it, and write `robots.txt` with `sitemap.xml` and `sitemap-pages.xml` only.

**Conflict 2 — `artifacts/villabooks-bali/src/lib/page-document.ts`.** Reverting `820df1d5` collides with `58ec00c`, `9c3d3bd` and `7fab6a6`, which all edited the same lines. Resolution:

- Keep `58ec00c`'s `socialType`, `socialSize` and `compareChild` lines and the `journalHero` test. They do not depend on the article path, and `compareChild` is used by the breadcrumb code further down the file.
- Take the reverted side for `socialImage` and `socialAlt` (`const socialImage = \`${SITE_ORIGIN}${shareImage(path)}\``), and take the reverted side for the `og:type` / `article:published_time` block.
- This means `7fab6a6`'s article timestamps **cannot** be kept in a rollback of the article path. The `article` parameter they read only exists because `820df1d5` added it; keeping those lines while removing the parameter throws `ReferenceError: article is not defined` during `prerender.mjs`. Earlier guidance to preserve them through a revert was wrong.

**Third step, and the build fails without it.** `58ec00c` made `src/pages/Blog.tsx` and `src/pages/BlogArticle.tsx` import `src/lib/journal-static.ts`, which `820df1d5` created and this revert deletes. The build stops with `Could not load .../src/lib/journal-static (imported by src/pages/Blog.tsx)`. Restore both files from before the article path:

```
git checkout 820df1d5^ -- artifacts/villabooks-bali/src/pages/Blog.tsx artifacts/villabooks-bali/src/pages/BlogArticle.tsx
```

**Fourth step, correctness, not caught by the gate.** `58ec00c` added a link to `/blog/bali-villa-pbjt-accommodation-tax-records` in the `/villa-financial-reporting-bali` section of `artifacts/villabooks-bali/src/lib/page-education.ts`. Delete it in the same revert. `seo-audit.mjs` will not fail on it: `/blog` is a runtime prefix, so journal links are skipped by the internal-link check. The earlier note that the build fails on this link was wrong; it does not.

Then:

```
git commit -m "Revert prerendered journal articles to gateway-served /blog/*"
```

Result of that run, on the same machine, from a clean tree: `seo-audit: PASS with warnings — 28 documents, 0 errors, 2 warnings`, and `Pre-rendered 28 distinct marketing pages and a real 404 document.` The rollback is executable; it takes four steps, not one.

Effect: `/blog/bali-villa-pbjt-accommodation-tax-records` stops being served as a file and falls back to the gateway's `/blog/:path*` rewrite, which returns the existing 404 JSON for a slug the Replit database does not hold. `sitemap-journal.xml` is no longer written. The marketing pages and the comparison cluster are untouched.

## Reverting the comparison cluster

Separate from the article path. Reverting `9c3d3bd` and `30e58fc` removes `/compare` and its four children. Six entries in `artifacts/villabooks-bali/src/pages/PageContent.tsx` (the related-guide map for `/airbnb-bookkeeping-bali`, `/airbnb-ota-reconciliation-bali`, `/villa-financial-reporting-bali`, `/villa-bookkeeping-cleanup-bali`, `/pt-pma-villa-bookkeeping`, `/villa-payroll-records-bali`) point at those pages and must be removed in the same revert. `sitemap-pages.xml` drops from 28 to 23 entries.

## Verifying a rollback

After any revert, check in this order:

1. The gate line from `pnpm run build:web` — `0 errors`. A rollback that does not build is not a rollback.
2. `curl -sI https://bali-villa-accounting-service.com/blog/bali-villa-chart-of-accounts` → 200
3. `curl -sI https://bali-villa-accounting-service.com/villa-financial-reporting-bali` → 200
4. `curl -sI https://bali-villa-accounting-service.com/sitemap-pages.xml` → 200, 28 `<loc>` entries (23 if the comparison cluster was reverted)
5. `curl -sI https://bali-villa-accounting-service.com/compare` → 200
6. Vercel deployment shows `READY` with the revert commit SHA, not just the previous one.

## Known non-revertible state

- The three `vercel.json` 301s stay in place regardless. Old URLs continue to resolve.
- Search Console keeps whatever was submitted. A rollback does not un-submit `sitemap-journal.xml`; remove it there if the path is withdrawn.
- The 77 pages that reference a dead asset hash (`/assets/index-DNBcDR-U.js`) are served by the Replit origin through the `/blog` rewrites, not by this build. They are outside this plan and need their own task; reverting or reverting-and-reapplying the article path does not touch them.
