# Architecture overview

Chef & Dish is a TypeScript pnpm monorepo and a single deployable modular monolith. The web app lives in `apps/web`; the Express API and Awilix composition root live in `apps/api`; reusable API contracts and shared tooling belong in `packages/contracts` and `packages/config` when those are needed. API features are placed under `apps/api/src/modules/<feature>` and separated into domain, application, infrastructure, and presentation layers. Cross-cutting HTTP, configuration, logging, database connections, and container setup live in `shared`, `infrastructure`, and `container`.

The API exposes liveness and database readiness probes, plus a Clerk-protected identity endpoint. Readiness reports unavailable until MongoDB connects. MongoDB transactions are not assumed; the production Atlas tier must be confirmed to support replica-set transactions before transactional business operations are implemented. Clerk verifies request sessions; application roles and user records remain in the identity module's next slice.

Pino logs request IDs and redacts common credential and personal-data fields. Sentry initializes only when a DSN is configured and disables default PII. OpenAPI is served at `/api/openapi.json`; Swagger UI is available at `/api/docs` only outside production. Central error handling returns stable safe envelopes and logs unexpected failures once.
