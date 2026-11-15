# Chef & Dish — Codex Agent Instructions

## Mission
Build a production-minded, single-company event operations application for 5–20 users. Implement incrementally, with small reviewed changes. Do not build features outside the requested phase.

## Stack (fixed unless explicitly approved)
- Monorepo: pnpm workspaces; TypeScript strict mode.
- Web: React, Vite, TanStack Router/Query/Table, React Hook Form, Zod, Tailwind, shadcn/ui.
- API: Node.js, Express, TypeScript, Mongoose, Zod, Awilix dependency injection.
- Auth: Clerk; server verifies tokens/sessions; roles and event assignments stored in MongoDB.
- Data: MongoDB Atlas. No Redis, BullMQ, microservices, or separate worker in MVP.
- Hosting: Cloudflare Pages for static web; Node-compatible managed hosting for API. Verify hosting capabilities before deployment.
- Tests: Vitest, Supertest, Playwright for critical journeys. Pino logs. OpenAPI API contracts.

## Architecture rules
1. Modular monolith, feature-first modules: identity, customers, events, inventory, stock-movements, reconciliation, billing, workforce, reporting, audit.
2. Within modules separate domain, application/use cases, infrastructure/repositories, presentation/routes. Pragmatic layering: avoid needless wrappers and abstractions.
3. Domain/application must not import Express, Clerk, or Mongoose. Inject repository interfaces and a unit-of-work/transaction abstraction via Awilix composition root.
4. Modules communicate through public application interfaces; no cross-module direct model access. Shared code only for genuine cross-cutting concerns.
5. Keep controllers thin, business rules in use cases/domain, persistence in repositories. No `any`, unsafe casts, magic strings, silent catches, or global mutable business state.
6. Use DTOs and Zod `.strict()` validation at HTTP boundaries. Central error mapping and structured logging; never leak internals to clients.
7. Never implement speculative features or dependencies. Favor clear, testable code over generic frameworks.

## Business invariants (non-negotiable)
- One company only. Roles: ADMIN and DRIVER; workers are managed records without login in MVP.
- Events can have many assigned drivers; any driver can record multiple LOAD/UNLOAD trips, with multiple item lines per trip.
- Actor identity comes from verified Clerk context, never a client-supplied driver ID. DRIVER may access only assigned events.
- Track item stock by location and state: available, reserved, out/on-event, damaged, missing. Do not allow negative available stock or dispatch beyond availability.
- Preserve immutable movement history. Corrections are authorized reversal/adjustment records, not silent edits/deletes.
- Unloading cannot exceed outstanding dispatched quantity; concurrency must be safe. Late returns reduce outstanding quantity.
- Outstanding != confirmed missing. Admin finalizes reconciliation before shortage charges; damage is separate. A shortage may be internal loss or customer-billable.
- Inventory mutation and movement/audit/outbox records must commit atomically in MongoDB transactions where required. Verify replica-set transaction support in the target database tier before production.
- All critical write endpoints (movements, invoice finalization, payments) require idempotency keys enforced by unique indexes and scoped appropriately.
- Monetary values are integer minor units, with currency explicitly stored. Invoice lines snapshot description, quantity, rate, tax/discount details, and approved shortage amounts. Issued invoices are not silently modified; use authorized adjustments/credit notes.
- Worker earnings, advances, payments and deductions are ledger transactions; pending = earned + additions - advances - payments - approved deductions. Prevent double payment.
- Avoid irreversible deletes for financial or stock records. Use auditing and status transitions.

## Security baseline
- Clerk verified server-side; MongoDB roles and per-event authorization checked on every sensitive operation; admin MFA recommended.
- Restrictive CORS allowlist, HTTPS, Helmet/security headers and CSP (test Clerk compatibility), request body limits, rate limiting, safe error responses.
- XSS: render text via React escaping; avoid dangerouslySetInnerHTML; escape dynamic PDF/HTML content; validate URLs.
- NoSQL injection: strict Zod DTOs; construct explicit query filters; never spread req.body into Mongoose filters/updates; disallow untrusted operators/pipelines.
- CSRF: evaluate credential transport; use Origin checks and CSRF defenses if cookie-authenticated cross-site writes. CORS alone is insufficient.
- Validate uploads (if introduced), webhook signatures, and environment variables; redact secrets/PII from logs; least-privilege DB credentials; backups and restore tests.
- Treat OWASP Top 10 as a testing checklist, not a claim of immunity.

## Performance and caching
- TanStack Query for frontend server state, targeted invalidation after mutations; avoid redundant Redux/global caches.
- MongoDB indexes based on queries; pagination and bounded filters; prevent N+1 and unbounded aggregations.
- No Redis initially. Never use cached stock balances to authorize writes. Add server cache only after measurement.
- Generate small PDFs on demand. Add jobs/outbox processing only when reliability/volume requires it.

## Repo layout
```
apps/web/src/{app,routes,features,shared}
apps/api/src/{modules,shared,infrastructure,container}
packages/contracts
packages/config
docs/architecture
docs/decisions
```
Each API module: `domain/`, `application/`, `infrastructure/`, `presentation/`.

## Agent workflow — minimize tokens
1. Before changes, inspect only relevant files; summarize the current phase and list a short plan (max 6 bullets).
2. Work on ONE phase and a small vertical slice at a time. Ask before major architectural changes or new dependencies.
3. Reuse existing patterns; avoid rewriting unrelated files. Prefer targeted diffs.
4. After each slice: run targeted typecheck, lint and tests; report commands/results. Do not claim tests passed if not run.
5. Respond concisely: changed files, design decisions, verification, blockers, next step. Do not dump full source files unless requested.
6. Update `docs/PROGRESS.md` with completed scope, decisions, migrations, tests and next action. Keep it brief.
7. If requirements are ambiguous, state the smallest safe assumption and proceed only when reversible; ask for decisions affecting money, stock correctness or security.
8. Never auto-deploy, purchase services, delete production data, or run destructive migrations without explicit approval.

## Definition of done per slice
- Requirements and acceptance criteria satisfied.
- Validation, authorization, error cases and auditability addressed.
- Relevant unit/integration tests added, including concurrent/idempotent edge cases for critical writes.
- Typecheck/lint/tests run or blockers explicitly documented.
- API contract and `docs/PROGRESS.md` updated.

## Observability and API documentation (mandatory)
- Use Pino structured JSON logs with request/correlation IDs; redact Authorization, cookies, tokens, passwords, and sensitive customer/worker data. Do not log full request bodies by default.
- Centralize typed application errors and HTTP mapping. Return stable machine-readable error codes, a safe user message, and requestId; never expose stacks or database details to clients. Report unexpected errors once, not repeatedly at each layer.
- Integrate Sentry for backend exceptions and frontend runtime errors using environment-specific DSNs. Disable or minimize PII collection, scrub sensitive context, configure sampling, and upload source maps securely in CI if used. Monitoring must degrade gracefully when Sentry is unavailable.
- Provide `/health/live` (process alive) and `/health/ready` (essential dependencies healthy) with no secrets exposed; keep readiness checks bounded and suitable for the chosen host.
- Define OpenAPI 3.1 contracts for every public API endpoint, including auth, request/response schemas, pagination, error codes, and idempotency requirements. Keep docs synchronized with Zod DTOs where practical, avoiding parallel manual schema definitions.
- Provide Swagger UI at `/api/docs` in development; in production disable it or restrict it to authorized admins. Serve `/api/openapi.json` with equivalent access policy. Never include credentials, example real customer data, or private infrastructure details.
- CI must validate OpenAPI schema and check contract drift, plus run tests for centralized error handling and authorization failures.
- Establish alerts for sustained 5xx error spikes, uncaught exceptions, and failed critical financial/stock operations; document alert routing and a short incident response procedure.
