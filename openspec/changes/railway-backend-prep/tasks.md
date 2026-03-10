# Tasks: Railway Backend Prep

## 1. Environment & Config
- [x] 1.1 Create root `.env.example` with required variables.
- [x] 1.2 Add `railway.json` to the repo root.

## 2. Dockerfile Fixes
- [x] 2.1 Update `WORKDIR` and `COPY` paths in `Dockerfile`.
- [x] 2.2 Replace hardcoded port with `${PORT:-8000}` in `CMD`.

## 3. Backend Code Updates using TDD skill
- [ ] 3.1 Implement CORS origin from environment variable in `app-backend/main.py`.
- [ ] 3.2 Add `DB_PORT` support in `app-backend/db.py`.
- [ ] 3.3 Implement API Key Global Middleware in `app-backend/main.py`.

## 4. Frontend Security Updates
- [ ] 4.1 Update `apiClient.ts` to include `X-API-Key` header.
- [ ] 4.2 Create `app-frontend/src/app/login/page.tsx` (Login UI).
- [ ] 4.3 Create `app-frontend/src/app/api/auth/login/route.ts` (Auth handler).
- [ ] 4.4 Create `app-frontend/src/middleware.ts` for route protection.
- [ ] 4.5 Create/Update `app-frontend/.env.example` with security variables.

## 5. Metadata & Documentation
- [ ] 5.1 Create `SECRETS_CHECKLIST.md` at root.
- [ ] 5.2 Update `README.md`: Append "## 🚀 Railway Deployment".
