# Category Refinement Specification

## API Specification
### GET /api/categories
- **Description**: Returns all categories from `dim_categories`.
- **Response**: `[{"id": 1, "name": "Food"}, ...]`

### GET /api/transactions
- **Query Parameter**: `categories` (Optional)
- **Format**: `?categories=1,2,3`
- **Behavior**: Filter transactions where `category_id` IN (1, 2, 3).

## UI Specification
### Multi-select Category Filter
- **Type**: Popover with Checkboxes.
- **Label**: "Categories (N selected)".
- **Options**: Sorted alphabetically by name.

### Global Number Formatting
- **Utility**: `formatCurrency(amount: number): string`
- **Pattern**: `$[Space][Integer part with spaces for thousands][Dot][Decimals]`
- **Example**: `12345.67` -> `$ 12 345.67`

## Database Migration Spec
1. ADD `temp_cat` to `transactions`.
2. UPDATE `transactions` SET `temp_cat` = `category`.
3. DROP `category` from `transactions`.
4. (Re-)initialize `init_db` to handle `category_id` correctly.
