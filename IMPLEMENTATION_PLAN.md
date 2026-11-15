# Chef & Dish — Incremental Implementation Plan

Read `AGENTS.md` first. Build a single-company production-minded MERN application. This file defines phase boundaries and acceptance criteria; do not implement future phases prematurely.

## Phase 0 — Decisions and foundation
- Confirm currency, stock locations, customer-billable shortage policy, taxes/invoice numbering, wage model, and MongoDB tier transaction support.
- Initialize pnpm workspace, strict TypeScript, ESLint/Prettier, env schema, Docker development option, CI (lint/typecheck/test), Vitest, basic API/web apps.
- Add architectural decision records and `docs/PROGRESS.md`.
- Establish API error envelope, Pino request IDs/redaction, OpenAPI 3.1 contract tooling, and basic liveness/readiness endpoints.
**Done:** reproducible setup, health endpoint, test/CI green, documented configuration and secrets.

## Phase 1 — Identity and security
- Clerk frontend sign-in; verified Express auth middleware; local user provisioning and ADMIN/DRIVER roles.
- Admin-only driver invitations/provisioning; inactive-user denial; per-resource authorization utilities.
- Helmet/CSP, CORS allowlist, limits, rate limiting, central typed error handling, Pino, request IDs, Zod DTOs.
- Add Sentry backend/frontend error reporting with sensitive-data scrubbing and environment separation; document DSN configuration.
- Add OpenAPI 3.1 generation/validation and development-only or admin-protected Swagger UI; document security schemes, errors and idempotency.
**Done:** anonymous access denied, drivers cannot elevate role, auth tests and security smoke tests pass.

## Phase 2 — Customers, events and assignments
- Customer CRUD; event lifecycle; driver assignments; admin dashboard and driver assigned-event list.
- Restrict drivers to assigned events; event status transitions validated.
**Done:** admin creates event and assigns two drivers; each driver sees only permitted events.

## Phase 3 — Item catalogue, stock and reservations
- Items/SKUs/categories, location stock balances, initial stock entries, reservations, release on cancellation.
- Define stock balance invariants, indexes, transaction context and audit trail.
**Done:** cannot reserve/dispatch beyond available stock, including concurrent requests.

## Phase 4 — Loading/unloading (highest priority)
- Driver mobile-friendly multi-item LOAD/UNLOAD forms; multiple trips/drivers; immutable movement ledger.
- Atomic stock balance changes; per-event outstanding quantities; idempotency; authorized corrections.
- Test duplicate requests, concurrent drivers, partial returns, invalid quantities and late returns.
**Done:** 30+20 plates loaded by two drivers, 25+15 returned, outstanding=10, history attributable and accurate.

## Phase 5 — Reconciliation
- Admin reviews outstanding stock, confirms missing/damaged/recovered quantities, sets internal-vs-customer charge, closes reconciliation.
- Support late return and authorized correction workflows; audit all decisions.
**Done:** pending returns never automatically become billed shortages; final totals reconcile with movement ledger.

## Phase 6 — Billing and customer payments
- Invoice drafts, itemized service/shortage/other lines, snapshot prices, tax/discount policy, PDF generation.
- Invoice numbering, finalization, partial payments, outstanding balance, idempotency, immutable issued invoices and adjustments.
**Done:** sample event generates accurate invoice; duplicate payment cannot be recorded; printable PDF works.

## Phase 7 — Workers and wages
- Worker profiles, event assignments, agreed rates, attendance, wage ledger, advances, partial payments, pending balances.
**Done:** worker paid across multiple events shows accurate earned/paid/pending and full audit history.

## Phase 8 — Reporting and usability
- Dashboard: upcoming/active events, stock out, shortages, customer receivables, worker payables.
- Search/filter/pagination, CSV export if needed, mobile usability and accessibility checks.
**Done:** key reports reconcile with underlying ledgers; indexed queries meet measured performance targets.

## Phase 9 — Production hardening and deployment
- Security review (OWASP), tests (unit/integration/E2E), concurrency/load smoke tests, dependency scan, Sentry alert verification, OpenAPI contract CI validation, backups and restore drill.
- Deploy static web to Cloudflare Pages; API to verified Node-compatible host; MongoDB Atlas and Clerk configured with production secrets/domains.
- Confirm TLS, CSP, CORS, health checks, operational logs, rate limits, deployment rollback and data recovery procedures.
**Done:** documented deployment, observability/incident response and recovery runbooks; health checks, alert delivery, API contract checks and production acceptance tests pass.

## API conventions
- Base `/api/v1`; JSON DTOs; cursor/offset pagination as appropriate; standardized errors; OpenAPI contracts.
- Example endpoints: `GET /me`, `POST /events`, `POST /events/:id/drivers`, `GET /items`, `POST /stock-movements`, `GET /events/:id/movements`, `POST /events/:id/reconciliation`, `POST /invoices`, `POST /invoices/:id/payments`, `POST /workers`, `POST /worker-payments`.
- Client must not send authoritative actor identity, prices, or balances. Derive/revalidate on server.

## Suggested MongoDB collections (refine before implementation)
`users`, `customers`, `events`, `event_assignments`, `items`, `item_categories`, `stock_locations`, `stock_balances`, `stock_reservations`, `stock_movements` (embedded item lines), `stock_reconciliations`, `workers`, `event_workers`, `worker_ledger`, `invoices`, `customer_payments`, `audit_logs`.

Indexes: unique Clerk user ID, item SKU, invoice number, scoped idempotency key; event/date/status, movement event/time, assignment event/driver, worker ledger worker/time. Create additional indexes only for demonstrated query needs.

## Sample end-to-end acceptance scenario
1. Admin creates a wedding event, assigns Driver A and Driver B, reserves 50 plates.
2. A loads 30, B loads 20 in separate trips.
3. B returns 25, A returns 15; outstanding = 10, not yet confirmed missing.
4. Admin reconciles 10 missing, approves a billable rate of 100 minor/major currency units as defined by configuration.
5. Invoice totals service charge + approved shortage charge + other charges - discounts + applicable taxes.
6. Customer makes partial payment; remaining receivable is correct.
7. Admin assigns two workers, records wages and advances; payable balances remain accurate.
8. Driver cannot access another event; duplicate loading/payment requests cannot create duplicate records.

## Codex phase prompt template
```
Read AGENTS.md and IMPLEMENTATION_PLAN.md. Implement ONLY Phase <N>, slice <description>.
Inspect the relevant files first. Provide a brief plan, then implement with minimal diffs.
Follow architecture, security, transaction and testing requirements.
Run relevant checks, update docs/PROGRESS.md, and report changed files, results and blockers.
Do not implement later phases or add infrastructure without asking.
```
