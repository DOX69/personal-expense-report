# Dashboard Improvements Specification

## 1. Description
This specification outlines the functional and non-functional requirements for the dashboard improvements, focusing on global filtering, interactive data visualizations, layout adjustments, and correct KPI calculations.

## 2. Requirements

### 2.1 Global Filtering
- **Requirement:** The dashboard must have a global filter state containing: Date Range (Start/End Date), Category, and Search Query.
- **Acceptance Criteria:**
  - A new filter bar exists below the header containing a Period Selector, a multi-select Category Popover, Search Input, and a "Reset Filters" button.
  - Modifying any of these filters immediately updates the data displayed in the KPI cards, charts, and recent transaction list.
  - The Category filter allows selecting multiple categories, updating the label to "Categories (N selected)".

### 2.2 Interactive Charts
- **Requirement:** Charts must allow users to cross-filter the dashboard data.
- **Acceptance Criteria:**
  - Clicking a segment on the `CategoriesChart` (Pie chart) updates the global `Category` filter and filters the rest of the dashboard.
  - `CashflowChart` must be a Bar Chart (Income vs Expense per month). Clicking a specific month bar updates the global `Date Range` filter to that specific month ("Custom Selection").

### 2.3 Correct KPI Calculations
- **Requirement:** KPI card titles and values must accurately reflect the specific filtered period, not the lifetime sum.
- **Acceptance Criteria:**
  - The backend `/api/dashboard/metrics` endpoint accepts and applies `start_date`, `end_date`, and `category` query parameters.
  - The returned metrics only include transactions within the specified date range and category.
  - KPI card titles dynamically change (e.g. "This Month's Income", "Last Month's Expenses", "Total Income").

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

### 2.6 Architecture Diagram & Documentation
- **Requirement:** The `README.md` must include an architecture diagram and a setup guide.
- **Acceptance Criteria:**
  - The README contains a Mermaid schema detailing the interaction between Next.js, FastAPI, MySQL, and Docker.
  - The README contains a step-by-step Windows setup guide for new users (Case B: Manual).

### 2.7 Global Number Formatting
- **Requirement:** All monetary values MUST follow a consistent, readable format.
- **Acceptance Criteria:**
  - Format: `$ [Integer space thousands].[Decimals]` (e.g., `$ 12 345.67`).
  - Applied to all KPI cards, chart tooltips, and transaction tables.
