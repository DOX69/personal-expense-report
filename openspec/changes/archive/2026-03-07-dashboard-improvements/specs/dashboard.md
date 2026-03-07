# Dashboard Improvements Specification

## 1. Description
This specification outlines the functional and non-functional requirements for the dashboard improvements, focusing on global filtering, interactive data visualizations, layout adjustments, and correct KPI calculations.

## 2. Requirements

### 2.1 Global Filtering
- **Requirement:** The dashboard must have a global filter state containing: Date Range (Start/End Date), Category, and Search Query.
- **Acceptance Criteria:**
  - A new filter bar exists below the header containing a Date Picker, Category Dropdown, and a "Reset All" button.
  - The Header search bar updates the global `searchQuery` state.
  - Modifying any of these filters immediately updates the data displayed in the KPI cards, charts, and recent transaction list.

### 2.2 Interactive Charts
- **Requirement:** Charts must allow users to cross-filter the dashboard data.
- **Acceptance Criteria:**
  - Clicking a segment on the `CategoriesChart` (Pie chart) updates the global `Category` filter and filters the rest of the dashboard.
  - `CashflowChart` must be converted to a Bar Chart (Income vs Expense). Clicking a specific month bar updates the global `Date Range` filter to that specific month.

### 2.3 Correct KPI Calculations
- **Requirement:** "This Month's Income" and "This Month's Expenses" must accurately reflect the specific filtered period, not the lifetime sum.
- **Acceptance Criteria:**
  - The backend `/api/dashboard/metrics` endpoint accepts `start_date` and `end_date` parameters.
  - The returned metrics only include transactions within the specified date range.

### 2.4 Layout Adjustments
- **Requirement:** The Sidebar must be collapsible and the Hydration error must be fixed.
- **Acceptance Criteria:**
  - The sidebar has a toggle button that minimizes it to an icon-only view.
  - The `layout.tsx` hydration error is resolved using `suppressHydrationWarning`.

### 2.5 Dedicated Import Workflow
- **Requirement:** The Drag & Drop CSV import must be on a separate, dedicated page.
- **Acceptance Criteria:**
  - A new route `/transactions/import` exists.
  - The page contains the dropzone and clear instructions on the expected CSV format and columns.
  - The `RecentTransactions` component no longer includes the dropzone.

### 2.6 Architecture Diagram
- **Requirement:** The `README.md` must include an architecture diagram.
- **Acceptance Criteria:**
  - The README contains a Mermaid schema detailing the interaction between Next.js, FastAPI, MySQL, and Docker.
