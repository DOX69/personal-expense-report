## 1. Build Fixes

- [x] 1.1 Correct `apiClient` import in `src/app/budgets/page.tsx`.
- [x] 1.2 Correct `apiClient` import in `src/app/subscriptions/page.tsx`.
- [x] 1.3 Correct `apiClient` import in `src/app/transactions/page.tsx`.
- [x] 1.4 Verify local production build success with `npm run build` in `app-frontend`.

## 2. Vercel Configuration

- [x] 2.1 Create `vercel.json` in the root directory specifying the root directory and build settings.
- [x] 2.2 Add `engines` field with `node: ">=20.x"` to `app-frontend/package.json`.

## 3. Vercel Project Setup

- [x] 3.1 Initialize new Vercel project setup autonomously.
- [x] 3.2 Configure `SUPABASE_URL` in Vercel.
- [x] 3.3 Configure `SUPABASE_ANON_KEY` in Vercel.
- [x] 3.4 Configure `SUPABASE_SERVICE_ROLE_KEY` in Vercel.
- [x] 3.5 Configure `APP_PASSWORD` in Vercel.

## 4. Pull Request and Master Merge

- [x] 4.1 Create a Pull Request using `gh` CLI and verify CI tests.
- [x] 4.2 Merge the PR into the `master` branch using `gh` CLI (bypass review as authorized).
- [x] 4.3 Link the `master` branch of GitHub to the Vercel project using the Vercel MCP.

## 5. Deployment and Verification

- [x] 5.1 Execute initial deployment to Vercel.
- [x] 5.2 Validate live production URL and core functionality.
