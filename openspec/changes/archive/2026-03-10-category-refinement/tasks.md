# Implementation Tasks: Category Refinement

## 1. Backend: Data Layer
- [x] 1.1 Update `CATEGORY_SEED_DATA` in `data_processor.py` with Title Case names and add `Life & Social`.
- [x] 1.2 Remove `normalize_description` logic from `data_processor.py`.
- [x] 1.3 Modify `init_db` in `db.py` to remove `category` column from `transactions` table.
- [x] 1.4 Modify `init_db` in `db.py` to remove `normalized_description` column from `transactions` table.
- [x] 1.5 Update `get_transactions` in `db.py` to join with `dim_categories` and return `category_name`.
- [x] 1.6 Update `get_transactions` to stop fetching `normalized_description`.
- [x] 1.7 Implement data migration logic for categories.

## 2. Backend: API Layer
- [x] 2.1 Add `GET /api/categories` endpoint in `main.py`.
- [x] 2.2 Update `GET /api/transactions` in `main.py` to handle comma-separated `categories` filter.
- [x] 2.3 Update API to stop returning `normalized_description`.
- [x] 2.4 Verify backend changes with `pytest app-backend/tests/`.

## 3. Frontend: Infrastructure & UI
- [x] 3.1 Create `src/utils/format.ts` with `formatCurrency` function.
- [x] 3.2 Remove redundant search bar from `src/components/layout/Header.tsx`.
- [x] 3.3 Refactor category filter in `src/app/page.tsx` to use multi-select dropdown.
- [x] 3.4 Update `CategoriesChart.tsx` tooltip styles (font color) and number formatting.
- [x] 3.5 Update `CashflowChart.tsx` tooltip number formatting.
- [x] 3.6 Remove duplicate description display in `RecentTransactions.tsx`.
- [x] 3.7 Apply global number formatting to all dashboard components.

## 4. Verification & Cleanup
- [x] 4.1 Run frontend tests (`npm test`).
- [x] 4.2 Verify full integration via Docker: `docker compose up -d --build --force-recreate`.
- [x] 4.3 verify if the category filter works as expected and came from the db dimension table dim_categories distinct categories values.
- [x] 4.4 Remove `check_cats.py` from root.
- [x] 4.5 Update `README.md` with new star-schema and simplified UI details.
- [x] 4.6 git commit, git push, verify CI pipeline using gh CLI
