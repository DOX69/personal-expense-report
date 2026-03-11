# Project Secrets & Environment Variables

This document tracks the required environment variables for the unified Next.js + Supabase architecture.

## Variable Mapping

| Variable                   | Where to set                     | Description                                  |
| -------------------------- | -------------------------------- | -------------------------------------------- |
| SUPABASE_URL               | Vercel env vars + GitHub Actions | Your Supabase Project URL                    |
| SUPABASE_ANON_KEY          | Vercel env vars + GitHub Actions | Supabase Anon Key (Public)                   |
| SUPABASE_SERVICE_ROLE_KEY  | Vercel env vars only             | Supabase Service Role Key (Server-side only) |
| APP_PASSWORD               | Vercel env vars only             | Your personal login password for the web app |

## Instructions
1. **Supabase Setup**: 
   - Go to your Supabase project.
   - Get the URL and Service Role Key from Project Settings -> API.
2. **Frontend Configuration**: 
   - [ ] Add `SUPABASE_URL` to Vercel/GitHub.
   - [ ] Add `SUPABASE_ANON_KEY` to Vercel/GitHub.
   - [ ] Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel.
   - [ ] Add `APP_PASSWORD` (your chosen login password) to Vercel.

## Security Note
`SUPABASE_SERVICE_ROLE_KEY` must **NEVER** be exposed to the client. It should only be used in server-side contexts like API routes or server components. GitHub Actions only needs `SUPABASE_URL` and `SUPABASE_ANON_KEY` for integration testing.
