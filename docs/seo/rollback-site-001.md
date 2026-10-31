# site-001 rollback plan

Scope: bali-villa-accounting-service.com, repo `ddandanell/Bali-Villa-Books`, Vercel project `bali-villa-books-api-serverff` (`prj_R4hssmwrWpUrqAn7wgPlxTSeUbX7`).

Written 31 October 2026 after the Independent QA review of the five direct-to-main commits (`15616105`, `820df1d5`, `9bd6dd69`, `d93d599b`, `c86e6da4`).

## What must not be reverted

`15616105` — the ten internal-link repoints off the three 301s. It is a correction, not part of the publishing path. Reverting it puts ten links back onto redirects.

`640ba6f` is the last commit before the publishing path existed. Removing the path by returning to it would also remove commit 1 and the comparison cluster (`9c3d3bd`, `30e58fc`). Do not use it as a rollback target.

## Reverting the prerendered-article path

If the static article path causes a problem, revert only these four commits, newest first:

```
git revert --no-commit c86e6da4 d93d599b 9bd6dd69 820df1d5
git commit -m "Revert prerendered journal articles to gateway-served /blog/*"
```

Effect: `/blog/bali-villa-pbjt-accommodation-tax-records` stops being served as a file and falls back to the gateway's `/blog/:path*` rewrite, which returns the existing 404 JSON for a slug the Replit database does not hold. `sitemap-journal.xml` returns to zero URLs. The marketing pages and the comparison cluster are untouched.

## Reverting this review batch

Branch `fix/site-001-qa-followups` only: close the PR, delete the branch. Nothing on main changes.

## Verifying a rollback

After any revert, check in this order:

1. `curl -sI https://bali-villa-accounting-service.com/blog/bali-villa-chart-of-accounts` → 200
2. `curl -sI https://bali-villa-accounting-service.com/villa-financial-reporting-bali` → 200
3. `curl -sI https://bali-villa-accounting-service.com/sitemap-pages.xml` → 200, 28 `<loc>` entries
4. `curl -sI https://bali-villa-accounting-service.com/compare` → 200
5. Vercel deployment shows `READY` with the revert commit SHA, not just the previous one.

## Known non-revertible state

- The three `vercel.json` 301s stay in place regardless. Old URLs continue to resolve.
- Search Console keeps whatever was submitted. A rollback does not un-submit `sitemap-journal.xml`; remove it there if the path is withdrawn.
- The 77 origin-rendered pages that reference a dead asset hash (`/assets/index-DNBcDR-U.js`) are a pre-existing condition, outside this plan, and need their own task.
