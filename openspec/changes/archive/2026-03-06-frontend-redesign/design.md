## Context

The current Personal Expense Report application is built as a monolithic Streamlit application interacting directly with a MySQL database via Python (`pandas` and `mysql.connector`/`sqlalchemy`). While sufficient for basic viewing, it lacks the interactivity, aesthetic flexibility, and robust state management required for a premium user experience (UX) and advanced features (e.g., drag-and-drop uploads, instant categorization feedback, micro-animations).

## Goals / Non-Goals

**Goals:**
- Completely separate the frontend presentation layer from the backend data/business logic.
- Deliver a modern, highly interactive, and visually appealing web application (Next.js) relying on a robust API (FastAPI).
- Implement a Test-Driven Development (TDD) approach using Jest for the frontend components.
- Enable new tracking features (Subscriptions, Budgets).

**Non-Goals:**
- Replacing the underlying MySQL database.
- Building a mobile app (iOS/Android native).
- Building an advanced AI model from scratch for categorization (we will rely on simple NLP heuristics and keyword matching initially).

## Decisions

1. **Frontend Framework**: **Next.js (React) + Tailwind CSS**
   - *Rationale*: Next.js provides an excellent routing system and is an industry standard for scalable dashboards. Tailwind allows for rapid, design-system-driven styling (crucial for achieving the modern, dark-mode aesthetic requested). React's component model maps perfectly to TDD with Jest.
   - *Alternatives considered*: Vite + React SPA (slightly simpler for pure TDD, but lacks built-in full-stack capabilities if needed later, and Next.js handles routing out-of-the-box better).

2. **Backend Framework**: **FastAPI**
   - *Rationale*: It is extremely fast, produces automatic OpenAPI documentation (Swagger), features built-in data validation (Pydantic), and integrates beautifully with our existing Python data processing logic.
   - *Alternatives considered*: Flask (slower, less modern type-hinting support), Django (overkill since we just need an API wrapper around our data pipeline).

3. **Data Fetching/State Management (Frontend)**: **React Query (@tanstack/react-query)**
   - *Rationale*: Excellent for caching, synchronizing, and updating server state in React applications, greatly simplifying data fetching.

4. **Charting Library (Frontend)**: **Recharts**
   - *Rationale*: Very mature, React-native, configurable, and plays well with Tailwind for styling charts like the Income vs Expenses graph and the Categories Donut chart.

## Risks / Trade-offs

- **Risk**: Rewriting the application from scratch might introduce temporary feature regression compared to the working Streamlit app.
  - *Mitigation*: The Streamlit app remains functional in the `master` branch while the `feature/frontend-redesign` is developed using TDD.
- **Risk**: "Hydration Tax" in Next.js when rendering massive data tables.
  - *Mitigation*: We will implement server-side pagination or virtualization (e.g., `react-window`) if the transaction list exceeds 1000 rows.
- **Risk**: The Sankey diagram is complex to render in React without recursive loops.
  - *Mitigation*: Enforce a strict DAG (Directed Acyclic Graph) at the API level so the frontend only receives unidirectional flow data.
