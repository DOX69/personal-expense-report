## ADDED Requirements

### Requirement: Hybrid Automatic Categorization
The system SHALL automatically parse and categorize imported CSV transactions using a deterministic keyword-to-category-ID mapping dictionary. All category values and field names SHALL be in English using `snake_case` convention.

#### Scenario: System matches a known keyword
- **WHEN** a transaction description contains a known keyword (e.g., "netflix", "spotify", "decideom")
- **THEN** the system assigns the corresponding `category_id` from the `dim_categories` table

#### Scenario: System encounters an unknown transaction
- **WHEN** a transaction description does not match any predefined keywords
- **THEN** the system assigns the fallback category `{flow_type: expense, flow_sub_type: variable, category: other, is_recurrent: false}`

#### Scenario: Employer names recognized as salary
- **WHEN** a transaction description contains "DECIDEOM" or "MONDIAL RELAY" and the amount is positive
- **THEN** the system assigns `{flow_type: income, flow_sub_type: active, category: salary, is_recurrent: true}`

#### Scenario: Currency transfers identified and excluded
- **WHEN** a transaction description matches the pattern "Change %"
- **THEN** the system assigns `{flow_type: transfer, flow_sub_type: internal, category: currency_transfer, is_recurrent: false}`

#### Scenario: Deterministic categorization
- **WHEN** the same CSV file is imported multiple times
- **THEN** every transaction SHALL receive the exact same `category_id` each time

### Requirement: 4-Pillar Categorization Structure
The system SHALL organize all categories into English-named flow types: `income`, `expense`, and `transfer`. Expense categories SHALL be further divided by `flow_sub_type`: `fixed` and `variable`. Income categories SHALL be divided by: `active`, `passive`, and `exceptional`.

#### Scenario: User reviews transaction categories
- **WHEN** the user filters transactions by category
- **THEN** the user can filter by `flow_type`, `flow_sub_type`, or `category` independently

### Requirement: Normalized Description Column
The system SHALL generate a `normalized_description` column for each transaction, containing a cleaned version of the original bank description.

#### Scenario: Description normalization
- **WHEN** a transaction is imported
- **THEN** the system creates a `normalized_description` by stripping transaction codes/reference numbers and applying title case, while preserving the original `description` unchanged

### Requirement: Full Historical Re-categorization
The system SHALL re-categorize all existing transactions using the new keyword-to-category-ID mapping during migration.

#### Scenario: Migration re-categorizes all rows
- **WHEN** the database migration script is executed
- **THEN** every existing transaction's old `category` string is mapped to the appropriate `category_id` in `dim_categories`, and a `normalized_description` is generated
