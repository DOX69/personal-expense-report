# Proposal: Prepare backend for Railway deployment

## Why
Prepare the backend code to be deployed on Railway.app. The current setup has hardcoded ports and CORS origins which are not compatible with Railway's dynamic environment.

## What
- **Dockerfile**: Update to use $PORT environment variable and set correct WORKDIR/COPY paths.
- **Backend API (CORS)**: Make `allow_origins` configurable via `ALLOWED_ORIGINS` env var.
- **Database Connection**: Add support for `DB_PORT` in database connection settings.
- **Railway Configuration**: Add `railway.json` for deployment instructions (Builder and Restart Policy only).
- **Environment Templates**: Create `.env.example` at the repo root with specific Railway variables.
- **Documentation**: Append "## 🚀 Railway Deployment" section to `README.md`.

## Security
- **Authentication Flow**:
    1. User visits Vercel frontend and enters a password.
    2. Successful login sets an `httpOnly` session cookie on the frontend.
    3. The Next.js frontend includes the `X-API-Key` (from environment variables) in the header of every backend API call.
    4. FastAPI on Railway validates the `X-API-Key` header for all protected routes.
- **Middleware**: Use Next.js middleware to enforce the session cookie presence for all frontend routes (except login).
