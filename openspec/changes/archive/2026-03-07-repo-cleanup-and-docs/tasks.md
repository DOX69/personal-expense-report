# Implementation Tasks

## Phase 1: Legacy Code Removal
- [x] Remove `app-backend/ui/` folder and all files inside (`dashboard.py`, `sidebar.py`, `__init__.py`).
- [x] Check `requirements.txt` for `streamlit` and remove it.

## Phase 2: Clean Code Refactoring
- [x] Review and refactor `app-backend/main.py` per Clean Code principles.
- [x] Review and refactor `app-backend/db.py` per Clean Code principles.
- [x] Review and refactor `app-backend/data_processor.py` per Clean Code principles.

## Phase 3: Documentation Updates
- [x] Update `README.md` to include a full French translation and an English translation.

## Phase 4: QA and Verification
- [x] Clean `*.json` and `*.txt` output useless files from tests (e.g., `test_failures.txt`, `pytest_output.txt`)
- [x] Run backend tests suite using `pytest`.
- [x] Restart Docker containers and verify application functionality manually or via integration testing, especially checking features from the `2026-03-07-dashboard-improvements` sprint.
- [x] Resolve any issues using systematic debugging and write tests to prevent future regressions.
- [x] Clean *.json *.txt output useless files from tests. Ex : test_failures.txt, test_output.txt, test_results.json, etc.