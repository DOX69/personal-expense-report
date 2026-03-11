# Specs: Supabase Next.js API Migration

## ADDED Requirements

### Requirement: Supabase-backed Categories API
The system SHALL provide a Next.js route handler to fetch categories from the Supabase `finance.dim_categories` table.

#### Scenario: Fetch all categories
- **WHEN** a GET request is made to `/api/categories`
- **THEN** the system SHALL return a JSON array of all categories ordered by ID ascending.

### Requirement: Filtered Transactions API
The system SHALL provide a Next.js route handler to fetch and filter transactions from Supabase.

#### Scenario: Filter by date range and search term
- **WHEN** a GET request is made to `/api/transactions` with `start_date`, `end_date`, and `search` parameters
- **THEN** the system SHALL return transactions matching the filters, including a join or lookup for category names.

### Requirement: Financial Metrics Aggregation
The system SHALL provide a Next.js route handler to aggregate income and expenses for a given period.

#### Scenario: Calculate dashboard metrics
- **WHEN** a GET request is made to `/api/dashboard/metrics`
- **THEN** the system SHALL return `total_income`, `total_expense`, and `net_cashflow` for the specified date range.

### Requirement: CSV Processing and Ingestion
The system SHALL provide a Next.js route handler to process uploaded CSV files and persist them to Supabase.

#### Scenario: Successful CSV upload and insertion
- **WHEN** a POST request is made to `/api/upload` with a valid `multipart/form-data` CSV file
- **THEN** the system SHALL parse the CSV, categorize transactions based on keywords, and insert them into the `finance.transactions` table.

## MODIFIED Requirements

### Requirement: Frontend Data Fetching
- **Existing**: `app-frontend` fetches data from `http://localhost:8000/api/...`
- **Delta**: `app-frontend` MUST fetch data from relative `/api/...` routes hosted within the Next.js application.
