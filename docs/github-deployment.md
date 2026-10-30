# GitHub checks and Vercel hosting

Run Node 24 and pnpm 10.26.1 from the repository root:

```
pnpm install --frozen-lockfile
pnpm check
pnpm hooks:install
```

`pnpm check` type-checks the workspace, runs editorial, analytics and deployment
regression tests, and builds the API and pre-rendered website. The pre-push hook
blocks pushes when these checks fail. Its success cache is invalidated by any
tracked/unignored file content change or Node runtime change. GitHub Actions
repeats the checks on a clean Ubuntu checkout for pushes to main and pull requests.
No database credentials, AI keys or paid research calls are required.

## Vercel

Import the **repository root**, not `artifacts/api-server`. `vercel.json` declares
the output directory, builds shared libraries first, and disables framework
autodetection. Node is selected through `package.json` engines, not an unsupported
`nodejs` property in `vercel.json`.

The Vercel frontend serves each marketing page's pre-rendered HTML, not a universal
homepage fallback. The original Replit production deployment remains the source
of truth for the database, daily publisher, Journals and sitemap. Vercel forwards
public API, Journal and sitemap traffic through `api/gateway.mjs`, which reads
`BACKEND_ORIGIN` (default: the public apex, while that apex still points at Replit).

## Move the public domain onto Vercel (single-push website)

Do this only after a separate backend hostname already reaches Replit. Moving the
apex onto Vercel while the gateway still targets the apex creates a proxy loop.

1. In Replit (`Bali-Regnskab` / Publishing → Domains), add
   `api.bali-villa-accounting-service.com` and keep the Replit deployment online.
2. In DNS (this domain already uses `ns1.vercel-dns.com` / `ns2.vercel-dns.com`),
   point `api` at the Replit deployment using the records Replit shows. Do **not**
   change the apex/`www` records yet. Confirm
   `https://api.bali-villa-accounting-service.com/api/healthz` returns JSON.
3. In the Vercel project (`prj_R4hssmwrWpUrqAn7wgPlxTSeUbX7` → Settings →
   Environment Variables), set Production (and Preview if desired):

   `BACKEND_ORIGIN=https://api.bali-villa-accounting-service.com`

   Redeploy so the gateway picks it up.
4. In that same Vercel project → Settings → Domains, add
   `bali-villa-accounting-service.com` and `www.bali-villa-accounting-service.com`.
   Accept Vercel’s suggested apex/`www` records (replace the current Replit A/AAAA
   targets). Keep the `api` records aimed at Replit.
5. Leave the Replit app running. Do not delete
   `https://replit.com/@b2b8/Bali-Regnskab`. Journal publishing, forms and the
   database stay there; only the public website edge moves to Vercel.

After step 5, merging to `main` updates the public site on the custom domain.
Republish Replit only when backend/API code itself changes.

Do **not** use `bali-villa-books.replit.app` as `BACKEND_ORIGIN`: that host
permanently redirects to the public apex and would loop after the domain flip.

GitHub Actions and Vercel are separate checks; a successful Git push is not proof
that either passed. Vercel's Git integration can start deployment alongside Actions.
For strict merge gating, enable a GitHub branch protection/ruleset requiring the
`check` job before merging pull requests. Installing the local hook protects
normal pushes from this workspace; GitHub settings are still needed to require
checks for every contributor.
