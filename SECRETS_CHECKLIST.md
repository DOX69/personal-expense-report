# SECRETS CHECKLIST

| Variable                   | Where to set                     | Description                                  |
| -------------------------- | -------------------------------- | -------------------------------------------- |
| NEXT_PUBLIC_SUPABASE_URL   | Vercel env vars + GitHub Actions | Your Supabase Project URL                    |
| SUPABASE_SERVICE_ROLE_KEY  | Vercel env vars only             | Supabase Service Role Key (Server-side only) |
| APP_PASSWORD               | Vercel env vars only             | Your personal login password for the web app |

## Instructions
1. **Supabase Setup**: 
   - Create a project on [Supabase](https://supabase.com).
   - Get the URL and Service Role Key from Project Settings -> API.
2. **Frontend Configuration**: 
   - Add `NEXT_PUBLIC_SUPABASE_URL` to Vercel/GitHub.
   - Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel.
   - Add `APP_PASSWORD` (your chosen login password) to Vercel.

