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
and the sitemap use the same adapter. The adapter connects directly to
`https://bali-villa-books.replit.app`, never back to the public domain.

This is **not a migration of the backend**. The custom domain can move to Vercel
only after the backend-origin exception has been published on Replit. That
exception serves only the adapter's public routes on the Replit hostname, with
an origin-only noindex header. Other Replit-host pages still redirect to the
canonical custom domain. The adapter does not forward the noindex header.

Cutover order:
1. Publish the backend change on Replit and verify that the Replit hostname
   returns JSON for `/api/healthz` and `/api/blog/posts`, HTML for `/blog`, and XML
   for `/sitemap.xml`, without redirecting to the custom domain.
2. Push the checked frontend adapter to GitHub and verify the Vercel production
   alias (including nested Journal reads and invalid enquiry validation).
3. On Vercel, remove the apex-to-www redirect and redirect www to the apex.
4. Change only the apex A record to the Vercel-confirmed `216.150.1.1`, preserving
   verification TXT, CAA and other unrelated records. Check domain configuration,
   HTTPS, canonical tags, dynamic routes and form validation after propagation.

Do not switch DNS while the backend hostname still redirects its public API to
the custom domain. Keep the Replit backend deployment running for its database
and Journal publisher. Do not turn off its hostname or move the database.

GitHub Actions and Vercel are separate checks; a successful Git push is not proof
that either passed. Vercel's Git integration can start deployment alongside Actions.
For strict merge gating, enable a GitHub branch protection/ruleset requiring the
`check` job before merging pull requests. Installing the local hook protects
normal pushes from this workspace; GitHub settings are still needed to require
checks for every contributor.
