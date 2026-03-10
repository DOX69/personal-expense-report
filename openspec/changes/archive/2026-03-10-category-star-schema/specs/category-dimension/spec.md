## ADDED Requirements

### Requirement: Category Dimension Table
The system SHALL maintain a `dim_categories` dimension table that stores all possible transaction categories as structured, multi-column records.

#### Scenario: Dimension table schema
- **WHEN** the database is initialized
- **THEN** a `dim_categories` table EXISTS with columns: `id` (INT PK), `flow_type` (VARCHAR), `flow_sub_type` (VARCHAR), `category` (VARCHAR), `is_recurrent` (BOOLEAN)

#### Scenario: All categories are pre-seeded
- **WHEN** the database is initialized
- **THEN** the `dim_categories` table SHALL contain all predefined category rows covering income types (active, passive, exceptional), expense types (fixed, variable), savings, investment, and transfer categories

### Requirement: Foreign Key Relationship
The `transactions` table SHALL reference `dim_categories` via a `category_id` foreign key column, replacing the old `category` VARCHAR column.

#### Scenario: Transaction references a valid category
- **WHEN** a transaction is saved to the database
- **THEN** its `category_id` column SHALL contain a valid ID that exists in `dim_categories.id`

#### Scenario: Querying transactions with category details
- **WHEN** the API returns transaction data
- **THEN** each transaction SHALL include the full category breakdown: `flow_type`, `flow_sub_type`, `category`, and `is_recurrent` from the joined `dim_categories` table

### Requirement: Currency Transfer Category
The system SHALL define a dedicated category with `flow_type: transfer` for internal currency account transfers.

#### Scenario: Currency transfer excluded from cashflow
- **WHEN** dashboard metrics (total income, total expense, net cashflow) are calculated
- **THEN** transactions with `flow_type = 'transfer'` SHALL be excluded from all sums
