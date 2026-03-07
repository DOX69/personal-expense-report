# Implementation Tasks

## Phase 1: Legacy Code Removal
- [ ] Remove `app-backend/ui/` folder and all files inside (`dashboard.py`, `sidebar.py`, `__init__.py`).
- [ ] Check `requirements.txt` for `streamlit` and remove it.

## Phase 2: Clean Code Refactoring
- [ ] Review and refactor `app-backend/main.py` per Clean Code principles.
- [ ] Review and refactor `app-backend/db.py` per Clean Code principles.
- [ ] Review and refactor `app-backend/data_processor.py` per Clean Code principles.

## Phase 3: Documentation Updates
- [ ] Update `README.md` to include a full French translation and an English translation.

## Phase 4: QA and Verification
- [ ] Run backend tests suite using `pytest`.
- [ ] Restart Docker containers and verify application functionality manually or via integration testing, especially checking features from the `2026-03-07-dashboard-improvements` sprint.
- [ ] Resolve any issues using systematic debugging and write tests to prevent future regressions.
- [ ] Clean *.json *.txt output useless files from tests. Ex : test_failures.txt, test_output.txt, test_results.json, etc.