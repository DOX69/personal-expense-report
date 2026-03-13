# Design: Supabase Next.js API Migration

## Context
The project is currently transitioning from a legacy FastAPI backend (MySQL/pandas) to a modern Next.js serverless architecture with Supabase (PostgreSQL). The frontend is built with Next.js App Router and already has a middleware-protected authentication flow.

## Goals / Non-Goals

**Goals:**
- Port existing data APIs (`categories`, `transactions`, `dashboard metrics`, `sankey`, `upload`) to Next.js Route Handlers.
- Standardize on Supabase JS client for all data access.
- Secure server-side routes using the Supabase Service Role key.
- Maintain the existing `finance` schema structure in Supabase.

**Non-Goals:**
- Deletion of the `app-backend/` directory or related legacy code.
- Significant UI/UX changes or component refactoring.
- Redesigning the database schema or data model.

## Decisions

- **Unified Supabase Helper**: Implement `getSupabaseServerClient()` in `src/lib/supabaseServer.ts`. This client will use the `SERVICE_ROLE_KEY` to bypass RLS for internal API logic while targeting the `finance` schema.
- **Route Handler Pattern**: Each legacy endpoint will have a corresponding `route.ts` in `src/app/api`.
- **Relative Fetching**: Replace `fetch('http://localhost:8000/...')` with `fetch('/api/...')` to ensure compatibility across development and production environments.
- **CSV Processing**: Port the Python-based `data_processor.py` logic (CSV parsing + categorization) to a JavaScript utility within the `/api/upload` route handler.

## Risks / Trade-offs

- **Security Risk**: Leakage of `SUPABASE_SERVICE_ROLE_KEY` to the client. This will be mitigated by strictly keeping it in `supabaseServer.ts` and only importing that file in Route Handlers.
- **Logic Disparity**: Subtle differences in how pandas vs. JavaScript handles data aggregations (e.g., date parsing or numeric precision).
- **Cold Starts**: Serverless functions may introduce slight latency for rarely used endpoints compared to a long-running FastAPI server.
