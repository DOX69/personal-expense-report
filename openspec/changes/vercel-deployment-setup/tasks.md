## 1. Build Fixes

- [ ] 1.1 Correct `apiClient` import in `src/app/budgets/page.tsx`.
- [ ] 1.2 Correct `apiClient` import in `src/app/subscriptions/page.tsx`.
- [ ] 1.3 Correct `apiClient` import in `src/app/transactions/page.tsx`.
- [ ] 1.4 Verify local production build success with `npm run build` in `app-frontend`.

## 2. Vercel Configuration

- [ ] 2.1 Create `vercel.json` in the root directory specifying the root directory and build settings.
- [ ] 2.2 Add `engines` field with `node: ">=20.x"` to `app-frontend/package.json`.

## 3. Vercel Project Setup

- [ ] 3.1 Initialize new Vercel project setup autonomously.
- [ ] 3.2 Configure `SUPABASE_URL` in Vercel.
- [ ] 3.3 Configure `SUPABASE_ANON_KEY` in Vercel.
- [ ] 3.4 Configure `SUPABASE_SERVICE_ROLE_KEY` in Vercel.
- [ ] 3.5 Configure `APP_PASSWORD` in Vercel.

## 4. Pull Request and Master Merge

- [ ] 4.1 Create a Pull Request using `gh` CLI and verify CI tests.
- [ ] 4.2 Merge the PR into the `master` branch using `gh` CLI (bypass review as authorized).
- [ ] 4.3 Link the `master` branch of GitHub to the Vercel project using the Vercel MCP.

## 5. Deployment and Verification

- [ ] 5.1 Execute initial deployment to Vercel.
- [ ] 5.2 Validate live production URL and core functionality.
