# Technical Design: Category Refinement

## Architecture Overview
The application follows a standard React (Next.js) frontend and FastAPI backend architecture. This change preserves the existing flow but refines the data structure between the backend and the database, and the interface between the frontend and the backend.

## Data Model Changes
### Database Schema
- **`dim_categories`**: This table will be updated with user-friendly names (Title Case) instead of snake_case. A new category `Life & Social` will be added.
- **`transactions`**: The `category` (VARCHAR) column will be **removed**. Transactions will now relate to `dim_categories` solely via `category_id`.

### Migration Strategy
1. Backup existing `transactions.category` values.
2. Update `dim_categories` with new names and IDs.
3. Map existing transactions to the correct `category_id` based on their temporary backup or current categorization logic.
4. Remove the `category` column from `transactions`.

## Interface Changes
### Backend API
- **`GET /api/categories`**: New endpoint to fetch all available categories from `dim_categories`.
- **`GET /api/transactions`**: Update the `category` filter parameter to accept multiple values (comma-separated string). The backend will perform an `IN` clause query.

### Frontend Components
- **`CategoryFilter`**: Refactor from a single-select dropdown to a multi-select dropdown (using a custom popover or a library component).
- **Global Formatting**: Implement a `formatCurrency` utility in `src/utils/format.ts` and apply it across all dashboard components.

## Implementation Details
### Backend
- Update `data_processor.py` for keyword-to-category mapping updates.
- Refactor `db.py` to handle the schema migration and join logic.
- Update `main.py` endpoints for dynamic categories and multi-filtering.

### Frontend
- Remove redundant search bar from `Header.tsx`.
- Implement multi-select state management in `page.tsx`.
- Fix chart tooltip styles in `CategoriesChart.tsx` for better legibility (white text on dark background).

## Risks & Mitigations
- **Data Loss During Migration**: We will ensure the migration script handles mapping logic carefully and verify with tests.
- **Multi-select Performance**: The number of categories is small (~30), so client-side filtering and backend `IN` queries will be highly efficient.
