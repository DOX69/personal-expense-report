# Personal Expense Report - Frontend & API

This is the primary application component for the **Personal Expense Report** project. It is built with **Next.js** and handles both the user interface and the serverless API endpoints that interact with **Supabase**.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **Visualization:** Recharts
- **Icons:** Lucide-React

## Getting Started

### 1. Setup Environment
Create a `.env.local` file in this directory:

```env
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
APP_PASSWORD="your-login-password"
```

### 2. Install & Run
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture Highlights
- **API Routes:** Found in `src/app/api/`. These logic handlers manage transaction imports, metrics calculation, and database synchronization.
- **Supabase Client:** Centrally managed in `src/lib/` to ensure secure server-side operations.
- **Components:** Modular React components for charts, transaction lists, and file uploads.

## Testing
The project uses **Jest** and **React Testing Library** for ensuring application stability.

```bash
npm test
```
