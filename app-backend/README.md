# Legacy Backend (FastAPI)

> [!WARNING]
> This directory refers to the **legacy architecture** of the project.

Previously, the application was split between a FastAPI backend and a Next.js frontend, using a MySQL database.

### Status
- **Status:** DEPRECATED
- **Current Architecture:** Unified Next.js + Supabase (see the root `README.md` for current documentation).

### Why is this still here?
This code is preserved temporarily for reference during the final transition phase. It demonstrates the original Python-based transaction logic and data processing using Pandas.

### Run (For reference only)
If you still need to run this legacy component:
1. Ensure you have the required Python environment.
2. `pip install -r ../requirements.txt`
3. `uvicorn main:app --reload`
