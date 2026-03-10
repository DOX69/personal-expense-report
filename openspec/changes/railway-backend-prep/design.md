# Design: Railway Deployment for Backend

## Context
The current backend setup is optimized for local Docker Compose development with hardcoded configuration. For Railway deployment, we need to adapt to dynamic environment variables (especially `PORT`) and provide a clear configuration for Railway's Docker builder.

## Proposed Changes

### 1. Dockerfile Adaptation
- Update `CMD` to use `${PORT:-8000}`.
- Ensure `WORKDIR` is `/app`.
- Fix `COPY` commands to correctly map the mono-repo structure (`app-backend/` to root in the container).

### 2. Configurable CORS
- Modify `app-backend/main.py` to use `os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000')`.

### 3. Database Port Support
- Update `app-backend/db.py` to include `port=int(os.getenv('DB_PORT', 3306))` in `mysql.connector.connect`.

### 4. Railway Configuration
- Add `railway.json` with build specs and restart policy.
- **CRITICAL**: Do NOT include `startCommand`; the Dockerfile `CMD` is the source of truth.

### 5. Environment Templates
- Create `.env.example` at the repo root containing exactly: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `ALLOWED_ORIGINS`, `API_SECRET_KEY`.
- **Note**: Use `railway variables set` to apply these to the project.

### 6. Backend Security (FastAPI)
- Implement `verify_api_key` dependency.
- Apply globally to the `FastAPI` instance.
- Header name: `X-API-Key`.

### 7. Frontend Security (Next.js)
- **Authentication Flow**:
    - **Step 1**: User enters password on `/login`.
    - **Step 2**: Route handler validates password against `APP_PASSWORD` and sets `httpOnly` cookie (`session_token`).
    - **Step 3**: `apiClient.ts` reads `NEXT_PUBLIC_API_SECRET_KEY` from env and adds it as `X-API-Key` header to all fetch requests.
- **Login Page**: A centered password form.
- **Auth API**: Route handler to set an `httpOnly` cookie.
- **Middleware**: Matcher to protect all routes (checks for `session_token`) except login and static assets.

### 8. README Documentation
- Append a new section "## 🚀 Railway Deployment" to `README.md`.
- **Security Schema**: Include the visual flow:
  `User → Vercel (Password) → Cookie → Next.js (API Key Header) → Railway (FastAPI Validation)`
- Include a table of required environment variables.
- Add a note about Railway MySQL auto-references (e.g., using `MYSQLHOST`, `MYSQLPORT` if applicable, though we use custom `DB_*` names).
- Include local Docker Compose run instructions.

## Risks / Trade-offs
- Using `0.0.0.0` as host is required for external access in Railway.
- Dynamic port handling ensures compatibility with Railway's load balancer.
