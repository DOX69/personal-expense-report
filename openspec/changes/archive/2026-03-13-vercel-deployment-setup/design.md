## Context

The Personal Expense Report project is a unified repository with a Next.js app in the `app-frontend` directory. It uses Supabase for the backend. Currently, it's only running locally. The goal is to move to a cloud-based deployment on Vercel to facilitate easier access and continuous delivery.

## Goals / Non-Goals

**Goals:**
- Automate deployment of the Next.js application to Vercel.
- Configure necessary environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `APP_PASSWORD`) in Vercel.
- Fix existing build blockers in the source code (import path issues).
- Link the repository to the Vercel project for automated CI/CD.

**Non-Goals:**
- Setting up or migrating the Supabase database (assumed pre-configured).
- Deploying the legacy `app-backend` (FastAPI).

## Decisions

### 1. Root Directory Configuration
- **Decision**: Use `vercel.json` in the root directory to specify `app-frontend` as the `rootDirectory`.
- **Rationale**: Explicitly defining the root directory in a configuration file ensures consistency across deployments and avoids manual setup errors in the Vercel dashboard.
- **Alternatives**: Configuring the root directory manually in the Vercel project settings UI.

### 2. apiClient Import Correction
- **Decision**: Fix incorrect import paths in `BudgetsPage`, `SubscriptionsPage`, and `TransactionsPage` from `@/utils/apiClient` to `@/lib/apiClient`.
- **Rationale**: This is the most direct fix for the build failure while maintaining the current file structure.
- **Alternatives**: Updating `tsconfig.json` paths or moving `apiClient.ts` to `src/utils/`.

## Risks / Trade-offs

- **[Risk] Config Drift** → [Mitigation] Keep all Vercel-specific configurations in `vercel.json` within the repository.
- **[Risk] Environment Variable Misconfiguration** → [Mitigation] Use the Vercel MCP to programmatically add secrets, and verify with a test build.
