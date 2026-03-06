## Why

The current monolithic Streamlit frontend limits the ability to deliver a premium, highly interactive, and visually stunning user experience. To achieve a functional, beautiful, and intuitive dashboard (resembling modern SaaS financial tools), we need to decouple the frontend from the Python backend. This will enable advanced UI/UX capabilities like micro-animations, instant loading, drag-and-drop CSV uploads, and a polished dark-mode aesthetic.

## What Changes

- **Frontend Tech Stack**: Introduce a new Next.js application using Tailwind CSS for styling and Jest for Test-Driven Development (TDD). 
- **Backend API**: Refactor the existing Streamlit Python logic into a REST API (using FastAPI) that serves JSON to the new frontend.
- **Dashboard UI**: Implement a completely redesigned dashboard with:
  - Top Metrics (Total Balance, Month's Income, Month's Expense, Savings Goal).
  - Income vs Expenses evolution chart.
  - Spending Categories pie/donut chart.
  - Recent Transactions list.
  - Strict directional Sankey Diagram (Source -> Current Account -> Destination) to avoid recursive visual loops.
- **Automated Categorization**: Introduce a hybrid categorization engine (matching keywords first, fallback to basic text analysis).
- **Capabilities**: Add tracking for Subscription/Recurring expenses and Target Budgets.
- **BREAKING**: The existing Streamlit UI will be completely removed and replaced.

## Capabilities

### New Capabilities
- `frontend-dashboard`: The core Next.js application, UI components, state management, and routing.
- `transaction-categorization`: The new automated categorization tagging engine based on predetermined rules.
- `budget-tracking`: The ability to set and track target budgets and savings goals.
- `subscription-tracking`: The ability to identify and display recurring fixed expenses/subscriptions.

### Modified Capabilities

## Impact

- **Affected Code**: `app/ui/dashboard.py` and `app/ui/sidebar.py` will be removed. `app/main.py` will be rewritten to run a FastAPI server.
- **Dependencies**: New Node.js/npm dependencies for Next.js, Tailwind, Recharts (or similar), and Jest. Python dependencies will add FastAPI and Uvicorn.
- **Architecture**: Transitions from a monolithic Python app to a decoupled Client (Next.js) - Server (FastAPI) architecture.
