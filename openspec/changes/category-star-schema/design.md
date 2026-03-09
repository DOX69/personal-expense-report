## Context

The application currently stores a single French string (e.g., "Dépenses Variables - Transport (Usage)") in the `transactions.category` column. This flat approach prevents multi-dimensional analysis and makes the categorization fragile — any logic change breaks consistency.

The database is MySQL 8.0, accessed via `mysql-connector-python` in `db.py`. Categorization logic lives in `data_processor.py` as a keyword-matching function. The frontend (Next.js) reads categories as plain strings from the API.

**Stakeholders**: Single user (personal finance). No multi-tenant concerns.

## Goals / Non-Goals

**Goals:**
- Implement a Kimball star-schema with a `dim_categories` dimension table.
- Make categorization deterministic: same description + amount → same `category_id`, always.
- Migrate all field names and category values to English `snake_case`.
- Add a `normalized_description` column (simple cleanup) while preserving the original.
- Correctly classify DECIDEOM and MONDIAL RELAY as salary income.
- Exclude "Change %" currency transfers from cashflow metrics.
- Re-categorize all historical data during migration.

**Non-Goals:**
- Multi-currency conversion (pivot currency, FX rates) — deferred to backlog.
- `dim_date` time dimension table — deferred to backlog.
- Complex NLP-based description translation — only simple cleanup for now.
- User-facing category editing UI — out of scope.

## Decisions

### Decision 1: Star Schema with `dim_categories` table
**Choice**: Create a separate `dim_categories` table with FK relationship to `transactions`.
**Why over inline columns**: A dimension table is the standard Kimball approach. It ensures referential integrity, makes it easy to add new categories without schema changes, and enables efficient JOINs for reporting.
**Alternative considered**: Adding `flow_type`, `flow_sub_type`, `category`, `is_recurrent` directly to `transactions`. Rejected because it denormalizes data and makes category updates require row-level changes across potentially thousands of rows.

### Decision 2: Keyword-to-ID dictionary mapping
**Choice**: Replace the cascading `if/elif` logic with a dictionary mapping `{keyword: category_id}`. The dictionary is static and loaded at import time.
**Why**: Deterministic, easy to test, easy to extend. Adding a new keyword is a one-line dictionary entry.
**Alternative considered**: Database-driven mapping table. Rejected for now — adds complexity without benefit for a single-user app.

### Decision 3: `flow_sub_type` column naming
**Choice**: Use `flow_sub_type` instead of `cost_type` to accurately reflect that it qualifies both income sub-types (`active`, `passive`, `exceptional`) and expense sub-types (`fixed`, `variable`, `savings`, `investment`).

### Decision 4: `normalized_description` as simple cleanup
**Choice**: Strip transaction codes/numbers, apply title case. Keep original `description` untouched.
**Why**: Reversibility — the original bank data is always available. Normalization is purely cosmetic for display purposes.

### Decision 5: Currency transfers as excluded category
**Choice**: Assign transactions matching `"Change %"` to a `currency_transfer` category with `flow_type: transfer`. Dashboard metrics will filter this `flow_type` out of income/expense calculations.
**Why over deletion**: Keeping them in the database preserves the full picture of account activity.

## Risks / Trade-offs

- **[Breaking schema change]** → Full migration script with rollback SQL provided. Test on a DB backup first.
- **[Keyword coverage gaps]** → Unknown descriptions still fall through to a fallback category (`other`). User can review and suggest new keywords iteratively.
- **[Frontend breakage]** → API response shape changes (category string → category object). Frontend must be updated in the same release. → Mitigate by shipping backend + frontend changes together.
- **[Historical re-categorization accuracy]** → Some old transactions may map to different categories than expected. → Mitigate by logging changes during migration for manual review.

## Migration Plan

1. **Backup**: Dump the existing `transactions` table.
2. **Create `dim_categories`**: Insert all category rows with IDs.
3. **Alter `transactions`**: Add `category_id` (INT) and `normalized_description` columns.
4. **Populate**: Run migration script to map old `category` strings → new `category_id` values, and generate `normalized_description`.
5. **Drop**: Remove old `category` (VARCHAR) column.
6. **Rollback**: Restore from backup if issues arise.

## Open Questions

- None at this time — all key decisions were resolved during the exploration phase.
