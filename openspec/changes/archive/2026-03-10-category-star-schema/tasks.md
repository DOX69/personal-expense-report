## 1. Database Schema

- [ ] 1.1 Create `dim_categories` table DDL in `db.py` with columns: `id` (INT PK AUTO_INCREMENT), `flow_type` (VARCHAR), `flow_sub_type` (VARCHAR), `category` (VARCHAR), `is_recurrent` (BOOLEAN)
- [ ] 1.2 Define and insert all seed rows into `dim_categories` (income: salary, dividends, rent, etc. | expense: housing, transport, food, etc. | transfer: currency_transfer)
- [ ] 1.3 Alter `transactions` table: add `category_id` (INT FK), add `normalized_description` (VARCHAR)
- [ ] 1.4 Write migration script to map existing `category` strings → new `category_id` values
- [ ] 1.5 Drop old `category` VARCHAR column from `transactions` after migration

## 2. Categorization Logic

- [ ] 2.1 Create keyword-to-category-ID mapping dictionary in `data_processor.py` (English, deterministic)
- [ ] 2.2 Add salary rules: DECIDEOM and MONDIAL RELAY → `{flow_type: income, flow_sub_type: active, category: salary}`
- [ ] 2.3 Add currency transfer rule: "Change %" pattern → `{flow_type: transfer, flow_sub_type: internal, category: currency_transfer}`
- [ ] 2.4 Implement `normalized_description` generation (strip reference numbers, title case)
- [ ] 2.5 Refactor `categorize_transaction()` to return `category_id` (INT) instead of a French string

## 3. API Layer

- [ ] 3.1 Update `save_transactions()` in `db.py` to insert `category_id` and `normalized_description`
- [ ] 3.2 Update `get_transactions()` to JOIN with `dim_categories` and return full category breakdown
- [ ] 3.3 Update `filter_transactions_df()` in `main.py` to support filtering by `flow_type`, `flow_sub_type`, and `category`
- [ ] 3.4 Update `/api/dashboard/metrics` to exclude `flow_type = 'transfer'` from cashflow calculations
- [ ] 3.5 Update `/api/dashboard/sankey` to use new category structure for node labels

## 4. Frontend Adaptation

- [ ] 4.1 Update transaction list component to display `flow_type`, `flow_sub_type`, `category` columns
- [ ] 4.2 Update dashboard filter dropdowns to use new category fields
- [ ] 4.3 Update Sankey diagram to use English category labels
- [ ] 4.4 Update KPI metrics display to reflect transfer exclusion

## 5. Tests

- [ ] 5.1 Write backend tests for new `categorize_transaction()` with keyword mapping (TDD: Red → Green)
- [ ] 5.2 Write backend tests for salary classification (DECIDEOM, MONDIAL RELAY)
- [ ] 5.3 Write backend tests for currency transfer exclusion ("Change %")
- [ ] 5.4 Write backend tests for `normalized_description` generation
- [ ] 5.5 Write backend tests for `dim_categories` JOIN queries
- [ ] 5.6 Update existing frontend tests to use new API response shape
- [ ] 5.7 Run full test suite and fix any regressions
