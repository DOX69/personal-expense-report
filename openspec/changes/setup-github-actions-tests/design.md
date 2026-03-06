# Design: GitHub Actions CI/CD Workflow

## Overview
The CI/CD workflow will be defined in `.github/workflows/ci.yml`. It will trigger on pushes and pull requests to the `master` branch. The workflow will use GitHub-hosted runners and Docker services for MySQL.

## Architecture
The workflow will consist of two primary jobs:
1. **Backend & Database Tests**:
   - Environment: `ubuntu-latest`.
   - Python version: 3.11 (as per `pyproject.toml`).
   - Service: `mysql:8.0`.
   - Steps:
     - Checkout code.
     - Set up Python.
     - Install dependencies from `requirements.txt`.
     - Wait for MySQL to be ready.
     - Run `pytest`.
2. **Frontend Tests**:
   - Environment: `ubuntu-latest`.
   - Node version: 20 (as per `docker-compose.yml`).
   - Steps:
     - Checkout code.
     - Set up Node.js.
     - Install dependencies using `npm install` in `app-frontend`.
     - Run `npm test`.

## Infrastructure
- **MySQL Service**: Configured with user, password, and database name matching the application defaults.
- **Secrets**: Use standard environment variables; no external secrets required for basic testing yet.

## Risks / Trade-offs
- **Execution Time**: Running independent jobs can increase total billable minutes but provides faster feedback for each component.
- **Database Migrations**: Tests assume the database schema is handled by the test setup (e.g., `tests/test_db.py` creating necessary tables).
