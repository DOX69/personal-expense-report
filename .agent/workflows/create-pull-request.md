---
description: Create a Pull Request with automated CI verification
---

# Create Pull Request Workflow

This workflow automates the process of creating a Pull Request and verifying its integrity through CI tests.

## Steps

1. **Verify GitHub CLI**
   - Run `gh --version` to ensure the tool is available.

2. **Analyze Changes**
   - Compare current changes with the default branch (e.g., `master` or `main`).
   - Run `git diff master` (or current integration branch).

3. **Cleanup**
   - Remove any temporary logs or test artifacts (`*.log`, `*.txt`).
   - Ensure the workspace is clean.

4. **Create Feature Branch**
   - Create a new branch descriptive of the changes.
   - `git checkout -b <descriptive-branch-name>`

5. **Stage and Commit**
   - `git add .`
   - `git commit -m "<conventional-commit-message>"`

6. **Push and Create PR**
   - Push the branch to remote.
   - Use `gh pr create` to create a PR with a clear title and description based on the diff.

7. **Verify CI Status**
   - Monitor CI pipelines using `gh pr checks --watch`.
   - If CI fails, resolve issues using the `general-fixes` workflow and push updates.

8. **Notify for Review**
   - Once CI passes, notify the user that the PR is ready for review.