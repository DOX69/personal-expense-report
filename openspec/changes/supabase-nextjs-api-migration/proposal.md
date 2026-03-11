# Proposal: Supabase Next.js API Migration

## Why
The current FastAPI backend (`app-backend/`) is built on MySQL and handled via pandas, which is becoming legacy as the project moves towards a more modern, unified architecture. Migrating to Next.js Route Handlers and Supabase (PostgreSQL) will:
- Consolidate the tech stack into JavaScript/TypeScript.
- Leverage Supabase's powerful features like Row Level Security (RLS) and easy scaling.
- Simplify production deployments (Vercel/Railway).
- Improve developer experience by having a single language across the stack.

## Impact
- **Backend**: The existing FastAPI backend will be marked as legacy but preserved for data migration and reference.
- **Frontend**: The Next.js application will become the primary host for all API logic via `src/app/api`.
- **Database**: All data operations will target Supabase's `finance` schema.
- **Security**: Authentication will be managed via Supabase, with server-side logic protected by the Service Role key.
- **Environment**: New Supabase-related environment variables will be required in all environments.

### Modified Capabilities
- **Transaction Management**: All CRUD and filtering for transactions moved to Supabase-backed API routes.
- **Dashboard Metrics**: Real-time aggregation of financial metrics via server-side Supabase queries.
- **CSV Data Ingestion**: Robust CSV parsing and validation ported to Next.js, with direct insertion into Supabase tables.
- **Category Management**: Unified category retrieval from the `finance.dim_categories` table.
