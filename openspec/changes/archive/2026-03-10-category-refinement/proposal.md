# Category Refinement

## Description
This change aims to refine the category-related features in the personal expense report application. The current implementation has some UX issues (broken filter, redundant search bar) and technical debt (duplicate category columns in `transactions` and `dim_categories`). We will standardize categories, improve the data schema, and enhance the dashboard UI.

## Goals
- Standardize category names to user-friendly title-case.
- Merge `transactions.category` into `dim_categories.category_id` (Star Schema).
- Improve the category filter to support multi-selection.
- Fix UI legibility issues (chart tooltip) and implement global number formatting.

## Impact
- **Backend**: `app-backend/db.py`, `app-backend/data_processor.py`, `app-backend/main.py`.
- **Frontend**: `app-frontend/src/app/page.tsx`, `app-frontend/src/components/dashboard/`, `app-frontend/src/components/layout/`.
- **Database**: Removal of `category` column in `transactions` table, updates to `dim_categories`.

### New Capabilities
- Multi-select category filtering on the dashboard.
- Global number formatting for consistent currency display ("$ 10 000").
- New "Life & Social" category for better transaction classification.

### Modified Capabilities
- Simplified database schema following a clean star schema pattern.
- Improved "Spending Categories" chart tooltip readability.
- Cleaned up header UI by removing redundant search bar.

## Requirements
- Category filter must allow selecting multiple values.
- `dim_categories` must match the actual values used in transactions.
- Currency display must follow the format `$ X XXX.XX`.
- No regression in existing transaction filtering or dashboard metrics.
