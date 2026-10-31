# site-001 rollback plan

Scope: bali-villa-accounting-service.com, repo `ddandanell/Bali-Villa-Books`, Vercel project `bali-villa-books-api-serverff` (`prj_R4hssmwrWpUrqAn7wgPlxTSeUbX7`).

Written 31 October 2026 after the Independent QA review of the five direct-to-main commits (`15616105`, `820df1d5`, `9bd6dd69`, `d93d599b`, `c86e6da4`). Revised the same day after the second review, which found that the four-commit revert left a link pointing at a file the revert deletes.

Everything is now on `main`; there is no side branch to close. A rollback means reverting commits on `main` and letting Vercel promote the result, then checking the live URLs. Nothing is reverted by deleting a branch.

## What must not be reverted

`15616105` — the ten internal-link repoints off the three 301s. It is a correction, not part of the publishing path. Reverting it puts ten links back onto redirects.

`640ba6f` is the last commit before the publishing path existed. Removing the path by returning to it would also remove commit 1 and the comparison cluster (`9c3d3bd`, `30e58fc`). Do not use it as a rollback target.

## Reverting the prerendered-article path

If the static article path causes a problem, revert these four commits, newest first:

```
git revert --no-commit c86e6da4 d93d599b 9bd6dd69 820df1d5
```

**Then edit the inbound link, or the build will not pass.** Commit `58ec00c` added a link to `/blog/bali-villa-pbjt-accommodation-tax-records` in the `/villa-financial-reporting-bali` section of `artifacts/villabooks-bali/src/lib/page-education.ts`. Reverting the four commits removes the article file but leaves the link, and `seo-audit.mjs` fails the build on an unresolved internal link. Delete that link entry in the same revert, then:

```
git commit -m "Revert prerendered journal articles to gateway-served /blog/*"
```

Effect: `/blog/bali-villa-pbjt-accommodation-tax-records` stops being served as a file and falls back to the gateway's `/blog/:path*` rewrite, which returns the existing 404 JSON for a slug the Replit database does not hold. `sitemap-journal.xml` returns to zero URLs. The marketing pages and the comparison cluster are untouched.

## Reverting the comparison cluster

Separate from the article path. Reverting `9c3d3bd` and `30e58fc` removes `/compare` and its four children. Six entries in `artifacts/villabooks-bali/src/pages/PageContent.tsx` (the related-guide map for `/airbnb-bookkeeping-bali`, `/airbnb-ota-reconciliation-bali`, `/villa-financial-reporting-bali`, `/villa-bookkeeping-cleanup-bali`, `/pt-pma-villa-bookkeeping`, `/villa-payroll-records-bali`) point at those pages and must be removed in the same revert. `sitemap-pages.xml` drops from 28 to 23 entries.

## Verifying a rollback

After any revert, check in this order:

1. `curl -sI https://bali-villa-accounting-service.com/blog/bali-villa-chart-of-accounts` → 200
2. `curl -sI https://bali-villa-accounting-service.com/villa-financial-reporting-bali` → 200
3. `curl -sI https://bali-villa-accounting-service.com/sitemap-pages.xml` → 200, 28 `<loc>` entries (23 if the comparison cluster was reverted)
4. `curl -sI https://bali-villa-accounting-service.com/compare` → 200
5. Vercel deployment shows `READY` with the revert commit SHA, not just the previous one.

## Known non-revertible state

- The three `vercel.json` 301s stay in place regardless. Old URLs continue to resolve.
- Search Console keeps whatever was submitted. A rollback does not un-submit `sitemap-journal.xml`; remove it there if the path is withdrawn.
- The 77 origin-rendered pages that reference a dead asset hash (`/assets/index-DNBcDR-U.js`) are a pre-existing condition, outside this plan, and need their own task.
