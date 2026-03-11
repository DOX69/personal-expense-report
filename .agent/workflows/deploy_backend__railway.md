---
description: How to deploy the backend to Railway
---

Follow these steps to deploy or update the backend service on Railway.

1. **Prerequisites**
   - Ensure Railway CLI is installed: `railway --version`
   - Ensure you are logged in: `railway login`

2. **Project Configuration**
   - Ask the user for the Railway Project ID if not already known.
   - Run: `railway link --project <PROJECT_ID>`

3. **Service Verification**
   - Verify the services exist: `railway status`
   - If MySQL is missing, add it: `railway add --database mysql`

4. **Environment Variables Check**
   - Verify variables for MySQL: `railway variable list --service MySQL`
   - Verify variables for Backend: `railway variable list --service personal-expense-report`
   - If variables need updating, refer to the [README.md](file:///c:/Users/ggrft/PycharmProjects/personal-expense-report/README.md) for the full command blocks.

5. **Deployment**
   - Run: `railway up` to deploy the current directory to the linked service.

6. **Verification**
   - After deployment, run the connection test: `python -m pytest tests/test_railway_connection.py`
