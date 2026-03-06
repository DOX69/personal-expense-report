# Specification: CI/CD Workflow Requirements

## User Requirements
- Run all tests on push to any branch.
- Run all tests on merge (push) to `master`.
- Support database, backend, and frontend test suites.
- Follow TDD approach (ensure workflow fails if tests fail).

## Functional Requirements
- **Trigger**: `on: [push]` for branches including `master`.
- **Backend Job**:
  - Install dependencies from `requirements.txt`.
  - Execute `pytest tests/` and `pytest app-backend/tests/`.
  - Must pass for the workflow to be successful.
- **Frontend Job**:
  - `cd app-frontend && npm install`.
  - `npm test`.
  - Must pass for the workflow to be successful.
- **Service Dependency**:
  - MySQL 8.0 service container for potential integration tests.
  - Environment variables: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.

## Non-Functional Requirements
- **Speed**: Use caching for `node_modules` and Python packages if possible (optional for initial version).
- **Reliability**: Use health checks for the MySQL service to avoid race conditions.
