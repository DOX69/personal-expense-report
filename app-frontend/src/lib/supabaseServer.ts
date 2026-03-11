import { createClient } from '@supabase/supabase-js';

// Ensure these exist at runtime. Non-null assertions tell TS we know they're there.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  // Rather than failing silently or causing obscure errors later,
  // we warn loudly if the environment is misconfigured.
  console.warn('⚠️ Supabase environment variables are missing! API routes may fail.');
}

export function getSupabaseServerClient() {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    db: {
      schema: 'finance',
    },
    auth: {
      persistSession: false, // Server client, no need to persist auth sessions
      autoRefreshToken: false,
    },
  });
}
