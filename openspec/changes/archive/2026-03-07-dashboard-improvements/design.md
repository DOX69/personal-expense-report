# Technical Design: Dashboard Improvements

## Architecture & State Management

### 1. Global Filter State
- **State Location:** Lift state up to the main `Dashboard` component (`src/app/page.tsx`) or utilize a URL state management library (like `nuqs`) if deep linking is required. Given the current structure, React `useState` within `Dashboard` is the most straightforward approach.
- **State Variables:**
  - `dateRange`: `{ start: Date | null, end: Date | null }` (or just predefined ranges like 'this_month', 'last_month', etc.)
  - `categoryFilter`: `string | null`
  - `searchQuery`: `string`
- **Data Flow:** The `Dashboard` component will fetch the raw transactions (or pass filter params to the backend) and distribute the *filtered* dataset to its child components (`MetricCard`, `CashflowChart`, `CategoriesChart`, `RecentTransactions`).

### 2. Backend Modifications (`app-backend/main.py`)
- **Metrics Endpoint:** Update `/api/dashboard/metrics` to accept optional `start_date` and `end_date` query parameters.
- **Transactions Endpoint:** Update `/api/transactions` to similarly accept filter parameters (`start_date`, `end_date`, `category`, `search`), allowing the database/pandas to handle filtering efficiently rather than sending the entire dataset to the client every time.
- **Sankey Endpoint:** Update `/api/dashboard/sankey` to accept the same date and category filters.

### 3. Interactive Charts
- **Categories Chart (Pie):** Add an `onClick` handler to the Recharts `<Pie>` cells. When a user clicks a slice representing "Groceries", the `setCategoryFilter('Groceries')` function is called, updating the global state.
- **Budget Chart (Bar):** Replace the `<AreaChart>` in `CashflowChart.tsx` with a `<BarChart>`. Add `onClick` handlers to drill down into specific months if a multi-month view is shown.

### 4. Layout Adjustments
- **Hydration Fix:** Add `suppressHydrationWarning={true}` to the `<html>` tag in `src/app/layout.tsx` to resolve the dark mode mismatch error.
- **Sidebar Collapse:** Introduce an `isSidebarOpen` state in a new `LayoutStateProvider` or simply within `layout.tsx` (if converted to a client component, though it's better to keep it server-rendered and use a client wrapper for the sidebar).

### 5. Dedicated Import Tab
- Move the `react-dropzone` implementation out of `RecentTransactions.tsx` into a new page: `src/app/transactions/import/page.tsx`.
- Add a markdown-rendered or beautifully styled instructional section detailing the required CSV columns: `date, description, amount, currency, category`.

## Risks & Trade-offs
- **Client vs Server Filtering:** Shifting filtering to the backend reduces payload size but increases API calls on every interaction. Given this is a local/personal tool, either works, but backend filtering is more scalable. We will prioritize backend filtering via query params.
