## 1. Setup

- [x] 1.1 Initialize Next.js application in an `app-frontend` (or similar) directory
- [x] 1.2 Configure Tailwind CSS, Jest (for TDD), and React Query
- [x] 1.3 Scaffold the FastAPI backend application structure in `app-backend`

## 2. API & Data Layer (FastAPI Backend)

- [x] 2.1 Refactor existing database connection and query logic (from `app/db.py`) to work with FastAPI
- [x] 2.2 Implement robust CSV upload and parsing endpoint (`/api/upload`)
- [x] 2.3 Implement Hybrid Categorization engine (keyword matching + NLP fallback)
- [x] 2.4 Build endpoints for Dashboard metrics (KPIs, Cashflow evolution, Category breakdown)
- [x] 2.5 Build specifically formatted endpoint for strict unidirectional Sankey diagram data

## 3. Core UI (Next.js Frontend)

- [x] 3.1 Design and build the main Shell Layout (Sidebar, Header, Dark Mode theme)
- [x] 3.2 Implement Top Metrics cards (Total Balance, Income, Expenses, Savings Goal)
- [x] 3.3 Integrate charting library (e.g., Recharts) for Income vs Expenses area chart
- [x] 3.4 Integrate charting library for Spending Categories donut chart
- [x] 3.5 Build the Recent Transactions list component with drag-and-drop upload zone

## 4. Advanced Capabilities

- [x] 4.1 Implement the Sankey Diagram component
- [x] 4.2 Develop Budget Tracking interface (Set targets, view progress) and corresponding API routes
- [x] 4.3 Develop Subscription Tracking interface (Identify recurring charges) and corresponding API routes

## 5. TDD & Polish

- [x] 5.1 Write Jest unit tests for critical frontend components and utility functions
- [x] 5.2 Write Pytest tests for the FastAPI backend logic
- [x] 5.3 Final aesthetic polish (Tailwind micro-animations, loading states, error handling)
- [x] 5.4 Safely remove legacy Streamlit UI code (`app/ui/`)
