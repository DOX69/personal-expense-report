# Proposal: Automate Testing with GitHub Actions

## Summary
Implement a GitHub Actions CI/CD workflow to automatically run backend, frontend, and database tests on every push and pull request to the `master` branch. This ensures code quality and prevents regressions.

## Motivation
Currently, tests are run manually. Automating this process ensures that all changes are verified against the full test suite before being merged into the main codebase, providing immediate feedback to developers and maintaining a stable production branch.

## Impact
- **CI/CD Pipeline**: New `.github/workflows/ci.yml` file.
- **Backend**: Python tests using `pytest` will be executed in a containerized environment.
- **Frontend**: Node.js tests using `jest` will be executed.
- **Database**: A MySQL service will be spun up in the CI environment to support database-dependent tests.
- **Documentation**: `README.md` will be updated with the CI status and setup instructions.
