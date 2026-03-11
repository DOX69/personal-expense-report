# Tasks: Supabase Next.js API Migration

## 1. Setup & Shared Infrastructure

- [x] 1.1 Install dependencies: `npm install @supabase/supabase-js uuid` in `app-frontend`.
- [x] 1.2 Create `app-frontend/src/lib/supabaseServer.ts` helper for secure, server-side data access.
- [x] 1.3 Create `app-frontend/src/types/api.ts` to define common data structures for the API.
- [x] 1.4 Configure environment: Add Supabase URL and Service Role Key to `.env.local`.

## 2. API Route Implementation

- [x] 2.1 Implement `GET /api/categories`: Fetch categories from the `finance` schema.
- [x] 2.2 Implement `GET /api/transactions`: Port filtering and search logic from FastAPI.
- [x] 2.3 Implement `GET /api/dashboard/metrics`: Replicate financial aggregation logic in PostgreSQL/JS.
- [x] 2.4 Implement `GET /api/dashboard/sankey`: Port graph data structure generation logic.
- [x] 2.5 Implement `POST /api/upload`: Migrate CSV validation and keyword-based categorization logic.

## 3. Frontend Refactoring

- [x] 3.1 Introduce `app-frontend/src/lib/apiClient.ts` as a wrapper for fetch calls to `/api`.
- [ ] 3.2 Update Main Dashboard (`page.tsx`) to consume Next.js API routes.
- [ ] 3.3 Update Transactions and Category views to use the new backend integration.
- [ ] 3.4 Perform end-to-end smoke test of the "Upload → Analyze → Visualize" flow.

## 4. Final Verification and Handover

- [ ] 4.1 Verify security: Ensure API routes are protected and service keys remain server-side.
- [ ] 4.2 Update project documentation: Reflect the new architecture in `README.md`.
- [ ] 4.3 Prepare PR: Consolidate changes and verify with existing test suite if possible.
