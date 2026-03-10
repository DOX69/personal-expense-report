## Context

The project uses a Kimball Star Schema with a `dim_categories` table. Currently, this table structure and its categorical values are not fully documented in the `README.md`. Additionally, test runs accumulate log and txt files, and Docker environments occasionally need a clean restart without losing data.

## Goals / Non-Goals

**Goals:**
- Provide clear documentation of `dim_categories` (columns, flow types, sub-types).
- Clean up the development environment from temporary test files.
- Standardize the "small fix" process via a new Agent workflow.

**Non-Goals:**
- Modifying the database schema or data.
- Automating the cleanup (this is a one-time manual cleanup with a documented workflow for future use).

## Decisions

- **Documentation Source**: We will use `DESCRIBE dim_categories` and `SELECT DISTINCT flow_type, flow_sub_type FROM dim_categories` to gather the source of truth directly from the running MySQL container.
- **Docker Restart Strategy**: Use `docker compose restart` or `docker compose up -d --force-recreate` to ensure images/containers are fresh, but critically **avoid** `docker compose down -v` to preserve the `db_data` volume.
- **Workflow Location**: Use `.agent/workflows/general-fixes.md` to keep it consistent with existing OpenSpec workflows.

## Risks / Trade-offs

- [Risk] Accidental volume deletion → Mitigation: Explicitly avoid `-v` flag and verify volumes before/after.
- [Risk] Stale documentation → Mitigation: The new workflow will encourage updating docs whenever schema changes.
