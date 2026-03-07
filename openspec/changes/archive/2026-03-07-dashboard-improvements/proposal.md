# Proposal: Dashboard Improvements

## Motivation
The current dashboard lacks interactivity, has calculation bugs in its KPIs, throws hydration errors, and could be better organized. This proposal aims to address these issues to create a more robust, interactive, and visually appealing dashboard experience.

## Proposed Changes
1. **Layout & Navigation:**
   - Fix Next.js hydration mismatch in `layout.tsx`.
   - Implement a smoothly collapsible left sidebar to maximize screen real estate.
   - Move the transaction Drag&Drop import functionality to a dedicated tab with clear CSV format instructions.

2. **Global Filtering & Interactivity:**
   - Implement global filters at the top of the dashboard (date/calendar selection, category selection).
   - Add a "Reset Filters" button.
   - Make the top search bar functional for searching transactions and categories.
   - Make charts interactive: clicking a pie slice or a bar chart segment will update the global filters, filtering all other visual components and KPIs on the dashboard.

3. **Data Visualization & KPIs:**
   - Fix KPI calculation logic: "This Month's Income" and "This Month's Expenses" currently sum all historical data. They must filter by the current month.
   - Replace the Income vs. Expenses line/area chart with a stacked or grouped Budget Bar Chart.

4. **Documentation:**
   - Update `README.md` to include a clear architecture schema (FastAPI, MySQL, Docker, Next.js) and data flow explanation.

## Impact
- **Affected Code:** `app-frontend/src/app/*`, `app-frontend/src/components/*`, `app-backend/main.py`
- **User Experience:** Vastly improved with interactive cross-filtering, functional search, and accurate period-specific metrics.
- **Development:** Adherence to Test-Driven Development (TDD) for new and modified logic. Use the `test-driven-development` and `systematic-debugging` skills for bugs and errors. For each new error, create a test for it to avoid the issue next time. TESTS ARE THE SOURCE OF TRUTH; modifying a test requires explicit user approval and justification.
