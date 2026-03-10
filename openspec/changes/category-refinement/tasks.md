# Implementation Tasks: Category Refinement

## 1. Backend: Data Layer
- [x] 1.1 Update `CATEGORY_SEED_DATA` in `data_processor.py` with Title Case names and add `Life & Social`.
- [x] 1.2 Update `categorize_transaction` in `data_processor.py` for new categories.
- [x] 1.3 Modify `init_db` in `db.py` to remove `category` column from `transactions` table.
- [x] 1.4 Update `get_transactions` in `db.py` to join with `dim_categories` and return `category_name`.
- [x] 1.5 Implement data migration logic in `db.py` to preserve existing category info during schema change.

## 2. Backend: API Layer
- [x] 2.1 Add `GET /api/categories` endpoint in `main.py`.
- [x] 2.2 Update `GET /api/transactions` in `main.py` to handle comma-separated `categories` filter.
- [x] 2.3 Verify backend changes with `pytest app-backend/tests/`.

## 3. Frontend: Infrastructure & UI
- [x] 3.1 Create `src/utils/format.ts` with `formatCurrency` function.
- [x] 3.2 Remove redundant search bar from `src/components/layout/Header.tsx`.
- [x] 3.3 Refactor category filter in `src/app/page.tsx` to use multi-select dropdown.
- [x] 3.4 Update `CategoriesChart.tsx` tooltip styles and formatting.
- [x] 3.5 Apply global number formatting to all dashboard components.

## 4. Verification & Cleanup
- [x] 4.1 Run frontend tests (`npm test`).
- [x] 4.2 Verify full integration via Docker: `docker compose up -d --build --force-recreate`.
- [x] 4.3 Remove `check_cats.py` from root.
