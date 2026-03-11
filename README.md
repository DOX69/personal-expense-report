# Personal Expense Report ✨

![CI Status](https://github.com/DOX69/personal-expense-report/actions/workflows/ci.yml/badge.svg)

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### About
**Personal Expense Report** is a financial dashboard for tracking personal expenses. 
It allows users to import bank statement files (CSV), automatically analyze, categorize, and save transactions in a database. It provides various visualizations and relevant metrics (KPIs) for effective budget management (Income / Expenses / Net Cashflow), as well as tracking recurring subscriptions and budgets.

### Tech Stack
The project is a unified Next.js application leveraging Supabase for backend services:
- **Frontend & API:** Next.js (App Router, Server Actions, API Routes).
- **Styling:** Tailwind CSS.
- **Database & Auth:** [Supabase](https://supabase.com) (PostgreSQL).
- **Data Processing:** Client-side and Server-side CSV parsing (PapaParse).
- **Data Visualization:** Recharts.
- **Testing:** Jest & React Testing Library.

### Architecture

```text
  +-------------------------------------------------+
  |                   👤 User                       |
  +-------------------------------------------------+
                          |
                          v
  +-----------------------+-------------------------+
  |         🖥️ Next.js Application                  |
  |  (UI, Recharts, Server-side API Routes)         |
  +-----------------------+-------------------------+
                          |
                (Supabase JS Client)
                          v
  +-----------------------+-------------------------+
  |         💾 Data Storage (Supabase)              |
  |   (PostgreSQL: Transactions & Categories)       |
  +-------------------------------------------------+
```

### 🔐 Security Schema
1.  **Session Authorization**: A password-protected login page sets an `httpOnly` session cookie via Next.js Server Actions.
2.  **Server-Side Supabase Client**: All database operations happen within API routes using a `supabase-js` client initialized with a `SUPABASE_SERVICE_ROLE_KEY`, ensuring no private keys are ever exposed to the client.

---

## 🚀 Deployment

### Supabase Setup
1. Create a project at [Supabase.com](https://supabase.com).
2. Execute the schema initialization (found in `supabase/migrations` or provided via SQL editor).
3. Copy your `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

### Vercel Deployment
Since the app is a unified Next.js project, you only need to deploy the `app-frontend` directory (or the root if pointing to the frontend subdirectory).

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `SUPABASE_ANON_KEY` | Public API Key (Anonymous) |
| `SUPABASE_SERVICE_ROLE_KEY` | Private Service Role Key (Server-side) |
| `APP_PASSWORD` | Password for your web login |

### 🛠️ Local Development
1. Clone the project and navigate to `app-frontend`.
2. Install dependencies: `npm install`.
3. Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="yours"
   SUPABASE_ANON_KEY="yours"
   SUPABASE_SERVICE_ROLE_KEY="yours"
   APP_PASSWORD="your_desired_password"
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Access the app at `http://localhost:3000`.

### 🧪 Running Tests
```bash
npm test
```

### 📂 Legacy Code
The `app-backend` directory contains the previous FastAPI/MySQL implementation. It is kept for reference but is no longer actively used in the current Supabase-based architecture.
