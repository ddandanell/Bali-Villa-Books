---
name: GitHub release validation
description: User requires repository checks before pushing; Vercel is not the original backend.
---
Run repository validation before pushing site changes to GitHub and distinguish a successful push from successful Actions and deployment results.

**Why:** The user reported that the pushed version failed and explicitly asked to check the repository before pushing. Local Replit success did not establish compatibility with the GitHub-connected host.

**How to apply:** Check actual GitHub/Vercel results, reproduce from a clean checkout without workspace-only files or secrets, and retain the pre-push validation. Do not claim the deployment succeeded just because the Git command did.

Keep the existing Replit deployment as the backend while Vercel serves the frontend; do not move the custom-domain DNS without establishing a separate backend origin first.

**Why:** Dynamic Journal HTML, live articles, form submissions, the database and the daily publisher are not a static Vite export. The gateway defaults `BACKEND_ORIGIN` to the public apex, so pointing that apex at Vercel before an `api.*` Replit hostname exists would loop. `bali-villa-books.replit.app` also redirects to the apex and cannot be used as the backend origin.

**How to apply:** Add `api.bali-villa-accounting-service.com` on Replit first, set Vercel `BACKEND_ORIGIN` to that host, redeploy, then attach the apex/`www` domains to project `prj_R4hssmwrWpUrqAn7wgPlxTSeUbX7`. Keep Replit online. See `docs/github-deployment.md`.

Probe actual runtime responses on the verified production alias after the host reports a successful build, and check content type/body as well as HTTP status.

**Why:** A protected immutable deployment URL returned a Vercel login page with HTTP 200, while the public alias revealed that a nested API route returned 404 despite passing unit tests and a successful deployment.

**How to apply:** Include a nested Journal API read, sitemap XML, an intentionally invalid enquiry that cannot save a lead, and a genuine unknown-page 404. Do not equate a login page or a green build with functioning application routes.
