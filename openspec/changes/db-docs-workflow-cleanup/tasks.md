## 1. Environment & Cleanup

- [x] 1.1 Create fix side branch `fix/database-docs-and-cleanup`
- [x] 1.2 Restart Docker environment (container and image, keep volumes)
- [x] 1.3 Delete useless `*.txt` and `*.log` files from the root

## 2. Database & Documentation

- [x] 2.1 Describe `dim_categories` in MySQL
- [x] 2.2 Update `README.md` with category details
- [x] 2.3 Create `.agent/workflows/general-fixes.md`

## 3. Verification & Git

- [x] 3.1 Local browser testing and update `QA-auditor.md`
- [ ] 3.2 Commit changes with descriptive message
- [ ] 3.3 Push to remote and create PR
- [ ] 3.4 Verify CI pass using `gh pr checks --watch`
