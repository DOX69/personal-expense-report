---
description: Deployment and configuration for Next.js app on Vercel
---

# Vercel Setup Workflow

Use this workflow to deploy the `personal-expense-report` frontend to Vercel.

## 1. Project Configuration
- Ensure a `vercel.json` file exists in `app-frontend/` with the following content:
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```
- Ensure `app-frontend/package.json` has the `engines` field set to `{"node": ">=20.x"}`.

## 2. Vercel Project Creation (Manual)
1. Go to the [Vercel New Project page](https://vercel.com/new).
2. Import the `DOX69/personal-expense-report` repository.
3. Configure the following in the Vercel UI:
   - **Framework Preset**: Next.js
   - **Root Directory**: `app-frontend`

## 3. Environment Variables
Add the following variables in the Vercel Project Settings:
- `SUPABASE_URL`: Your Supabase Project URL.
- `SUPABASE_ANON_KEY`: Your Supabase Anonymous Key.
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key.
- `APP_PASSWORD`: The password for accessing the web UI.

## 4. Deployment
- Push changes to the `master` branch (or create a PR to `master`).
- Vercel will automatically trigger a build and provide a production URL.
