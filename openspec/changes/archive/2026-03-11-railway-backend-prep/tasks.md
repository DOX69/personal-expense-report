# Tasks: Railway Backend Prep

## 1. Environment & Config
- [x] 1.1 Create root `.env.example` with required variables.
- [x] 1.2 Add `railway.json` to the repo root.

## 2. Dockerfile Fixes
- [x] 2.1 Update `WORKDIR` and `COPY` paths in `Dockerfile`.
- [x] 2.2 Replace hardcoded port with `${PORT:-8000}` in `CMD`.

## 3. Backend Code Updates
- [x] 3.1 Implement CORS origin from environment variable in `app-backend/main.py`.
- [x] 3.2 Add `DB_PORT` support in `app-backend/db.py`.
- [x] 3.3 Implement API Key Global Middleware in `app-backend/main.py`.

## 4. Frontend Security Updates
- [x] 4.1 Update `apiClient.ts` to include `X-API-Key` header.
- [x] 4.2 Create `app-frontend/src/app/login/page.tsx` (Login UI).
- [x] 4.3 Create `app-frontend/src/app/api/auth/login/route.ts` (Auth handler).
- [x] 4.4 Create `app-frontend/src/middleware.ts` for route protection.
- [x] 4.5 Create/Update `app-frontend/.env.example` with security variables.

## 5. Phase 2: Security Polish & Integration
- [ ] 5.1 Migrate `app-frontend/src/app/transactions/page.tsx` to `apiClient`.
- [ ] 5.2 Migrate `app-frontend/src/app/transactions/import/page.tsx` to `apiClient`.
- [ ] 5.3 Migrate `app-frontend/src/app/budgets/page.tsx` to `apiClient`.
- [ ] 5.4 Migrate `app-frontend/src/app/subscriptions/page.tsx` to `apiClient`.
- [ ] 5.5 Delete unused `app-backend/auth.py`.
- [ ] 5.6 Audit repo for hardcoded URLs and secrets.

## 6. Metadata & Documentation
- [x] 6.1 Create `SECRETS_CHECKLIST.md` at root.
- [x] 6.2 Update `README.md`: Append "## 🚀 Railway Deployment".
- [ ] 6.3 Run pre-commit checks and tests.
- [ ] 6.4 Commit and push all Phase 2 changes.
