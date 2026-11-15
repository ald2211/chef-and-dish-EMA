# Chef & Dish — Getting Started

## Prerequisites
- VS Code with Codex extension
- Node.js LTS
- Git
- pnpm

## Project Setup
1. Create a folder named `chef-and-dish`.
2. Place `AGENTS.md`, `IMPLEMENTATION_PLAN.md`, and `START_HERE.md` in the project root.
3. Open the folder in VS Code.
4. Open Codex.
5. Ask Codex to read the project instructions and implement Phase 0 only.

## First Codex Prompt
Read AGENTS.md and IMPLEMENTATION_PLAN.md.
Start Phase 0 only. Inspect the repository, propose a
concise setup plan, and implement the project foundation
following the specified modular monolith architecture.
Do not implement later phases.
Run relevant checks and update docs/PROGRESS.md.

## Development Workflow
- Implement one phase at a time.
- Review generated code.
- Run lint, typecheck, and tests.
- Commit completed phases to Git.
- Keep docs/PROGRESS.md updated.

## Deployment Target
- Frontend: Cloudflare Pages
- Backend: Hostinger Node.js hosting
- Database: MongoDB Atlas
- Authentication: Clerk
- Error tracking: Sentry
- API documentation: OpenAPI + Swagger UI