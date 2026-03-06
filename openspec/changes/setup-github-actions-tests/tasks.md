# Implementation Checklist: GitHub Actions CI/CD

## Infrastructure Setup
- [x] 1.1 Create `.github/workflows/` directory.
- [/] 1.2 Implement `.github/workflows/ci.yml` with backend and frontend jobs.

## Test Integration
- [ ] 2.1 Configure MySQL service in `ci.yml`.
- [ ] 2.2 Add steps to install Python dependencies and run `pytest`.
- [ ] 2.3 Add steps to install Node dependencies and run `npm test` in `app-frontend`.

## Verification & Documentation
- [ ] 3.1 Push changes to a side branch `feature/setup-ci-github-actions`.
- [ ] 3.2 Verify GitHub Actions run successfully on the branch.
- [ ] 3.3 Create and merge Pull Request to `master`.
- [ ] 3.4 Wait for the Pull Request to be merged. And validate that the CI is working.
- [ ] 3.5 Update `README.md` with CI status badge and instructions.
