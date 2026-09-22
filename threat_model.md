# Threat Model

## Project Overview

This repository is a pnpm TypeScript monorepo with a small production-facing surface today: a public React/Vite marketing site in `artifacts/villabooks-bali` and an Express 5 API in `artifacts/api-server`. Shared packages in `lib/` provide the OpenAPI contract, generated client/Zod types, and PostgreSQL/Drizzle database access.

At the time of this scan, the production site is effectively a public landing page with fixed outbound links to WhatsApp and Calendly. The API exposes only `/api/healthz`. There is no implemented user authentication, admin panel, webhook receiver, file upload path, or database-backed business workflow yet.

Assumptions used for this threat model:
- Production runs with `NODE_ENV=production`
- Replit deployment terminates TLS for client/server traffic
- `artifacts/mockup-sandbox` is never deployed to production and is development-only unless proven otherwise

## Assets

- **Brand integrity and visitor trust** — the public marketing site is the primary production asset today. If an attacker can modify what visitors see or where CTA buttons send them, they can redirect leads, phish visitors, or damage the business.
- **Application secrets** — environment variables such as `DATABASE_URL` and any future third-party API keys must remain server-only. Leakage would enable database or integration compromise.
- **Infrastructure availability** — even though the API surface is minimal, the public site and `/api/healthz` endpoint must remain responsive.
- **Future business and customer data** — the workspace includes database and API scaffolding, so future expansion is likely to introduce PII, financial records, and operational data that will require stronger authorization and validation guarantees.

## Trust Boundaries

- **Browser to frontend application** — all visitors reach the landing page as unauthenticated users. Any browser input must be treated as untrusted.
- **Browser to API (`/api`)** — public requests cross from untrusted clients into the Express server. Every future route must validate input and avoid exposing internal errors.
- **API to PostgreSQL** — `lib/db` provides direct database access via `DATABASE_URL`. Any future server-side query path must prevent injection and scope data access correctly.
- **Frontend to third-party services** — the production page links to WhatsApp and loads Calendly assets from `assets.calendly.com`. These external services are outside repository control and form a supply-chain/trust boundary.
- **Production vs. development-only tooling** — `artifacts/mockup-sandbox` is a development surface and should normally be excluded from production findings unless deployment reachability changes.

## Scan Anchors

- **Production entry points**: `artifacts/villabooks-bali/src/main.tsx`, `artifacts/villabooks-bali/index.html`, `artifacts/api-server/src/index.ts`, `artifacts/api-server/src/app.ts`, `artifacts/api-server/src/routes/**`
- **Highest-risk code areas if the app grows**: new API route handlers under `artifacts/api-server/src/routes`, request/response contracts in `lib/api-spec` and `lib/api-zod`, DB access in `lib/db`
- **Public surface**: landing page routes in `artifacts/villabooks-bali/src/App.tsx`, outbound WhatsApp/Calendly links in `artifacts/villabooks-bali/src/pages/Home.tsx`, health endpoint in `artifacts/api-server/src/routes/health.ts`
- **Dev-only area to usually ignore**: `artifacts/mockup-sandbox/**`

## Threat Categories

### Tampering

The main tampering risk today is modification of public content or request handling across the browser/server boundary. The frontend currently uses fixed strings and static content, which reduces direct input-handling risk, but any future lead forms, query-driven rendering, or API endpoints must treat all client input as untrusted and validate it server-side. Any pricing, reporting, or bookkeeping logic introduced later must be enforced on the server, not in the browser.

Required guarantees:
- All future API endpoints MUST validate request bodies, params, and query strings before use.
- Client-visible business logic MUST NOT be the sole enforcement point for pricing, permissions, or workflow state.
- Any future database interaction MUST use parameterized/ORM-backed queries rather than string-built SQL.

### Information Disclosure

The current production frontend is intentionally public, but server-side secrets and future business data are not. The API should avoid leaking stack traces, raw database errors, or environment-dependent details. Shared libraries must remain safe to import without accidentally exposing secrets to client bundles.

Required guarantees:
- Secrets such as `DATABASE_URL` and future integration keys MUST remain server-only and MUST NOT be imported into frontend code.
- API error responses and logs MUST avoid exposing sensitive internals or raw secrets.
- Future user or financial data returned from the API MUST be scoped explicitly to the requester and minimized to only necessary fields.

### Denial of Service

The deployed surface is small, but public endpoints can still be abused if the app grows. `express.json()` and `express.urlencoded()` are enabled, so future public POST routes should consider explicit body-size limits and expensive-operation controls.

Required guarantees:
- Future public endpoints MUST apply appropriate request-size limits and avoid unauthenticated expensive operations.
- External calls added later MUST use reasonable timeouts and failure handling.
- Health and marketing routes SHOULD remain lightweight and not depend on slow external services for basic availability.

### Supply Chain / Third-Party Script Trust

The landing page depends on third-party services outside the repository, especially Calendly assets loaded directly in `artifacts/villabooks-bali/index.html` and outbound CTA flows to WhatsApp/Calendly. Any third-party script included in the page executes with the same privileges as first-party frontend code, so external integrations must be added sparingly and reviewed carefully. This is a live concern rather than a hypothetical future one: the current frontend globally loads Calendly's widget script on every page load even though `Home.tsx` can fall back to opening the Calendly URL in a new tab if that script is unavailable.

Required guarantees:
- Third-party scripts and embeds MUST be limited to business-critical integrations and reviewed as trusted code execution.
- If a third-party booking or analytics flow can function without executing remote script in the page origin, the lower-trust option SHOULD be preferred.
- New third-party frontend dependencies SHOULD be minimized and pinned where practical.
- If the site later handles user sessions, forms, or sensitive data in-browser, third-party script usage MUST be re-evaluated with stronger hardening expectations.
