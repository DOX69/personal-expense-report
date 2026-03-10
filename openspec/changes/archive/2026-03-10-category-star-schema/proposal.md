## Why

The current categorization system stores a flat French string (e.g., "Dépenses Variables - Transport (Usage)") directly in the `transactions` table. This creates several problems:

1. **No analytical granularity** — You cannot independently filter by flow type (income/expense), cost type (fixed/variable), or functional category (transport, food) without parsing strings.
2. **Non-deterministic risk** — If categorization logic changes, re-importing the same data could produce different categories. The system needs a fixed, keyword-to-category-ID mapping.
3. **French-only values** — Field names and category values mix French and English, making the codebase inconsistent.
4. **Salary misclassification** — Employer names like DECIDEOM and MONDIAL RELAY are not recognized as salary income.
5. **Currency transfers pollute metrics** — Transactions containing "Change %" are internal currency account transfers but are currently counted as expenses.

## What Changes

- **New `dim_categories` dimension table** (Kimball star schema) with columns: `id`, `flow_type`, `flow_sub_type`, `category`, `is_recurrent`.
- **`transactions` table refactored**: `category` string replaced by `category_id` (FK to `dim_categories.id`). New `normalized_description` column added (simple cleanup of bank descriptions).
- **All field names and category values in English**, following `snake_case` convention.
- **Deterministic categorization**: keyword-to-category-ID mapping dictionary ensures identical inputs always produce identical outputs.
- **Salary rules**: DECIDEOM and MONDIAL RELAY mapped to `{flow_type: income, flow_sub_type: active, category: salary, is_recurrent: true}`.
- **Currency transfer exclusion**: Transactions with "Change %" in description assigned to `currency_transfer` category and excluded from cashflow metrics.
- **Full re-categorization migration** (Option A): All historical data re-categorized using new rules.

## Capabilities

### New Capabilities
- `category-dimension`: Star-schema dimension table for categories with `flow_type`, `flow_sub_type`, `category`, and `is_recurrent` columns. Replaces flat string categorization.

### Modified Capabilities
- `transaction-categorization`: Categorization logic refactored to English, deterministic keyword→category_id mapping, with new salary and currency transfer rules.

## Impact

- **Backend**: `data_processor.py` (categorization logic rewritten), `db.py` (new DDL for `dim_categories`, altered `transactions` schema, migration script), `main.py` (API responses must JOIN with `dim_categories`).
- **Frontend**: Dashboard and transaction components must adapt to the new multi-column category structure (filter by `flow_type`, `flow_sub_type`, `category`).
- **Database**: **BREAKING** — Schema migration required. `transactions.category` (VARCHAR) replaced by `transactions.category_id` (INT FK). New `dim_categories` table created. All historical data re-categorized.
- **Tests**: All categorization tests must be updated to use new English category values and `category_id` references.
