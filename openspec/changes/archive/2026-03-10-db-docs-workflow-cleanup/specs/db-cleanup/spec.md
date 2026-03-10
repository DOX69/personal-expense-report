## ADDED Requirements

### Requirement: Database Documentation
- **GIVEN** a running MySQL database with a `dim_categories` table.
- **WHEN** the `README.md` is updated.
- **THEN** it must include a section describing the schema of `dim_categories` and its key values (`flow_type`, `is_recurrent`).

### Requirement: Environment Cleanup
- **GIVEN** existing test logs and `.txt` files in the root directory.
- **WHEN** the cleanup is performed.
- **THEN** all `*.log` and `*.txt` files from the root directory that are not part of the core project must be deleted.

### Requirement: General Fixes Workflow
- **GIVEN** the need to standardize small maintenance tasks.
- **WHEN** the `general-fixes.md` workflow is created in `.agent/workflows`.
- **THEN** it must provide clear steps for analyzing, fixing, and documenting small issues, including PR and CI validation.
