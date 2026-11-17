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
- Added Mongo-backed identity records with `ADMIN`/`DRIVER` roles and active status. `/me` now resolves the app record and returns the role; unprovisioned or inactive accounts receive a safe 403.
- Initial admin bootstrap is restricted to IDs in `INITIAL_ADMIN_CLERK_USER_IDS`; the ID only creates a missing record and never changes an existing role.
- Updated OpenAPI and `.env.example`. API typecheck, lint, and OpenAPI validation passed; tests were not run.
- Added admin-only `POST /api/v1/drivers` to provision a Clerk user ID as a DRIVER. Request validation is strict; it cannot set roles or reactivate inactive accounts, and existing non-driver roles are preserved and rejected.
- Updated OpenAPI. API typecheck, lint, and OpenAPI validation passed; tests were not run.
- Next: configure Clerk development keys and implement events with driver assignments and per-event authorization.

## Phase 2 â€” Events

- Added admin event creation and driver assignment, plus event list/detail endpoints scoped to the authenticated role and assigned driver IDs.
- Event input is strict and bounded; assignments require an active DRIVER and use `$addToSet` to make repeats safe. OpenAPI covers the event endpoints.
- API typecheck, lint, and OpenAPI validation passed; tests were not run.
- Next: move to the next requested business module after confirming the remaining policy decisions that affect stock and billing.
