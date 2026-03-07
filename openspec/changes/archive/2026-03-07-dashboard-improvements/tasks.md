# Implementation Tasks: Dashboard Improvements

## 1. Foundation & Layout
- [x] 1.1 Fix Hydration Mismatch: Add `suppressHydrationWarning` to the `<html>` tag in `src/app/layout.tsx`.
- [x] 1.2 Interactive Sidebar: Add collapsible state to `Sidebar.tsx` (toggle between `w-64` and `w-20`) and adjust main content margin accordingly.
- [x] 1.3 Create Import Page: Scaffold `src/app/transactions/import/page.tsx`, move the Dropzone from `RecentTransactions.tsx`, and add markdown instructions for the CSV format.

## 2. Backend API Updates (FastAPI)
- [x] 2.1 Update `/api/dashboard/metrics`: Accept optional `start_date` and `end_date` query parameters. Filter the pandas dataframe before calculating `total_income`, `total_expense`, and `net_cashflow`.
- [x] 2.2 Update `/api/transactions`: Accept optional `start_date`, `end_date`, `category`, and `search` query parameters to filter transactions returned.
- [x] 2.3 Update `/api/dashboard/sankey`: Accept `start_date` and `end_date` query parameters.

## 3. Global Filtering State & UI
- [x] 3.1 Global State: In `src/app/page.tsx` (Dashboard), implement state for `dateRange` (start/end), `categoryFilter`, and `searchQuery`.
- [x] 3.2 Filter UI: Add a date picker (or pre-defined buttons like "Last 30 Days", "This Month"), category dropdown, search bar, and "Reset Filters" button at the top of the dashboard.
- [x] 3.3 Data Passing: Update data fetching hooks (`useQuery`) in `Dashboard` to pass the global filter states to the backend API endpoints.

## 4. Charts & Interactive Visualizations
- [x] 4.1 Budget Bar Chart: Replace `<AreaChart>` in `CashflowChart.tsx` with a `<BarChart>` depicting Income and Expenses per month.
- [x] 4.2 Interactive Categories: Add `onClick` handlers to `CategoriesChart.tsx` pie slices to set the global `categoryFilter` state.
- [x] 4.3 Interactive Budget Chart: Add `onClick` handlers to `CashflowChart.tsx` bars to set the global `dateRange` filter to that specific month.

## 5. QA Audit
- [x] 5.1 Act as a QA-auditor based on the guidelines in `QA-auditor.md` to validate the product delivery before finalizing documentation and releasing.

## 6. Documentation
- [x] 6.1 Architecture Diagram: Update the main `README.md` with an architecture diagram showing the Next.js frontend, FastAPI backend, and CSV data flow.
- [x] 6.2 Setup Tutorial: Add a step-by-step guide in `README.md` for setting up the project on a new Windows machine (Env setup, dependencies, running).
