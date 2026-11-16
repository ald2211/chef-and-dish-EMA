# Progress

## Phase 0 — foundation

- Started workspace structure for React/Vite and Express; strict TypeScript, ESLint, Prettier, pnpm scripts, and environment example/schema are in place.
- Added API bootstrap with Awilix composition, bounded JSON body parsing, Helmet, allowlisted CORS, Pino request IDs/redaction, safe error envelopes, optional PII-minimized Sentry initialization, OpenAPI 3.1 endpoint, development Swagger UI, and liveness/readiness probes.
- Added web shell with TanStack Router/Query and optional PII-minimized Sentry initialization. No business features or authentication implemented.
- Added optional local MongoDB Compose service, CI workflow, and OpenAPI validation/test commands.
- Added local setup/check instructions and documented that production disables both Swagger UI and the raw OpenAPI endpoint.
- Pending policy decisions: currency, stock locations, customer-billable shortage policy, taxes and invoice numbering, wage model, and MongoDB tier transaction support.
- Verification passed locally: `pnpm lint`, `pnpm typecheck`, `pnpm test` (2 API tests; web has no test files yet and is configured to pass), `pnpm validate:openapi`, and `pnpm build`.
- Local startup follow-up: API and Vite now load the root `.env` from their workspace directories; API validation selects only its declared keys so frontend variables do not fail strict validation. Verified `pnpm dev` starts both apps and API liveness/readiness return `ok` locally.
- GitHub Actions has been configured but not run remotely.
- Next: Phase 1 identity and security. Confirm pending business policies and target Atlas tier before the phases that depend on them.

## Phase 1 — Identity foundation (in progress)

- Added Clerk's React provider and sign-in controls, Express session verification, and `GET /api/v1/me`, which returns only the verified Clerk user ID.
- API Clerk middleware is enabled only when both server keys are configured and validates authorized parties against the CORS origin allowlist. `/me` fails closed with a safe 503 when Clerk is not configured and a 401 for unauthenticated requests.
- Added Clerk key names to `.env.example` and documented the protected endpoint in OpenAPI. No database user records or role assignment are implemented in this slice.
- Verification: API/web lint and typecheck passed; OpenAPI validation passed. Test suite not run.
- Next: configure Clerk development keys, add Mongo-backed ADMIN/DRIVER records and authorization, and decide the safe initial-admin provisioning method before adding invitations.
