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
- Next: confirm pending business policies and target Atlas tier before the phases that depend on them. GitHub Actions has been configured but not run remotely.
