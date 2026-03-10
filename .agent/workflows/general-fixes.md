---
description: Standard workflow for small technical fixes or documentation updates
---

Use this workflow for small, non-feature changes like documentation updates, dependency fixes, or technical debt cleanup.

## Steps

1. **Root Cause Analysis**
   - Use the `systematic-debugging` skill to understand the issue.
   - For documentation tasks, inspect the source of truth (DB schema, code, etc.).

2. **Fix & Document**
   - Implement the minimal code fix.
   - Update relevant documentation (e.g., `README.md`, JSDoc).
   - If the fix is complex, create an OpenSpec proposal first.

3. **Validation**
   - Run regional tests (e.g., `pytest tests/` or `npm test`).
   - For UI changes, perform manual browser testing and document in `QA-auditor.md`.

4. **Cleanup**
   - Remove any temporary logs or test artifacts (`*.log`, `*.txt`).
   - Ensure the workspace is clean.

5. **PR & CI Verification**
   - Commit changes with a clear message.
   - Push to a side branch and create a PR.
   - **Mandatory**: Use `gh pr checks --watch` to verify that all CI builds pass before marking as complete.
