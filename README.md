# Chef & Dish

Single-company event operations application. The repository is a pnpm monorepo with a React/Vite web app and an Express API; API capabilities are added incrementally by phase.

## Local development

1. Install Node.js 24 and pnpm 10.
2. Run `pnpm install`.
3. Copy `.env.example` to `.env` and set `MONGODB_URI`.
4. For a local MongoDB instance, run `docker compose up -d mongodb`.
5. Run `pnpm dev`.

The API listens on port 3000 and the web app on port 5173. Liveness is at `/api/v1/health/live`; readiness at `/api/v1/health/ready`. OpenAPI JSON and Swagger UI are available at `/api/openapi.json` and `/api/docs` outside production. Production disables both documentation routes.

## Checks

Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm validate:openapi`, and `pnpm build`. CI runs each check after a frozen-lockfile install.

Local Compose MongoDB is a development convenience. Production transaction behavior depends on the selected MongoDB Atlas tier and must be confirmed before implementing transactional stock or financial operations.
