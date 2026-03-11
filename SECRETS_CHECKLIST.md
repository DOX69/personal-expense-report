# SECRETS CHECKLIST

| Variable                   | Where to set                     | Description                                  |
| -------------------------- | -------------------------------- | -------------------------------------------- |
| API_SECRET_KEY             | Railway → backend service vars   | Random 32+ char secret, shared with frontend |
| NEXT_PUBLIC_API_SECRET_KEY | Vercel env vars + GitHub Actions | Same value as API_SECRET_KEY                 |
| APP_PASSWORD               | Vercel env vars only             | Your personal login password for the web app |

## Instructions
1. **Generate Secrets**: Run `openssl rand -hex 32` to generate values for `API_SECRET_KEY`.
2. **Backend**: Add `API_SECRET_KEY` to your Railway project variables.
3. **Frontend**: 
   - Add `NEXT_PUBLIC_API_SECRET_KEY` (same value) to Vercel/GitHub.
   - Add `APP_PASSWORD` (your chosen login password) to Vercel.
