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
the public API through a narrow server-side adapter so anonymous forms can work
without exposing credentials or accepting arbitrary upstream targets. Journals
and the sitemap are rewritten to the existing production site.

This is **not a migration of the backend**. Keep
`https://bali-villa-accounting-service.com` pointed at the existing Replit
deployment. Moving that domain to Vercel without first establishing a different
verified backend origin would cause proxy loops. Do not move its DNS as part of a
routine GitHub push. Backend functionality also requires that deployment to remain
available.

GitHub Actions and Vercel are separate checks; a successful Git push is not proof
that either passed. Vercel's Git integration can start deployment alongside Actions.
For strict merge gating, enable a GitHub branch protection/ruleset requiring the
`check` job before merging pull requests. Installing the local hook protects
normal pushes from this workspace; GitHub settings are still needed to require
checks for every contributor.
