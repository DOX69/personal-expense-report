## Why

The repository contains legacy Streamlit code (`app-*`) that is no longer used since the migration to Next.js and FastAPI. The codebase also needs syntax and readability improvements per the Clean Code standards, and the README needs to be bilingual (French and English) to accommodate a wider audience.

## What Changes

- **Remove legacy code**: Delete `app-backend/ui/` directory and any other unused Streamlit-related files.
- **Refactoring**: Apply Clean Code standards across the backend Python files to improve readability.
- **Documentation**: Update `README.md` to include both English and French versions.
- **Verification & QA**: Add tests to prevent future errors and ensure the dashboard components still work.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- None

## Impact

- **Backend**: Removal of unused `ui` module (`app-backend/ui/`). Formatter and clean-code updates across python backend files.
- **Documentation**: Substantial update to `README.md`.
