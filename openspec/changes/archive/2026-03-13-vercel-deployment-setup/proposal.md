## Why

The project is currently only running locally and needs to be deployed to Vercel to be accessible via the web. Automated deployment will ensure continuous integration and delivery, providing a production environment for the Personal Expense Report application.

## What Changes

- **Fix `apiClient` Imports**: Correct the alias paths in `BudgetsPage`, `SubscriptionsPage`, and `TransactionsPage` from `@/utils/apiClient` to `@/lib/apiClient` to fix build failures.
- **Vercel Configuration**: Add a `vercel.json` file in the root directory to manage build settings and the root directory for the app.
- **Project Setup on Vercel**: Autonomously create and configure a new Vercel project using the Vercel MCP.
- **Environment Variables**: Document and configure required variables within the Vercel dashboard.

## Capabilities

### New Capabilities
- `vercel-deployment`: Automating the deployment of the Next.js frontend to Vercel, including build configuration and environment secret management.

### Modified Capabilities
- None

## Impact

- `app-frontend` build process and production stability.
- Repository structure (introduction of `vercel.json`).
- Secure environment variable management via Vercel Secrets.
