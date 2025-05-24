import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Attempt to use NEXT_PUBLIC_SUPABASE_URL if SUPABASE_URL is not explicitly set for server-side.
// This can be useful if you only want to manage one URL variable across client/server in some setups,
// though for admin actions, distinct handling via SUPABASE_SERVICE_ROLE_KEY is critical.
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing environment variable SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseServiceKey) {
  throw new Error("Missing environment variable SUPABASE_SERVICE_ROLE_KEY");
}

// Note: Unlike the client, the server client is typically created on-demand
// or per request, especially in serverless environments, to ensure it uses the correct
// context if ever needed (though for basic admin client, a singleton can also work).
// For simplicity and consistency with the PRD example for admin client, we'll provide a direct creator.

export const getSupabaseAdmin = (): SupabaseClient => {
  // Always create a new client for server-side to avoid potential state issues across requests,
  // especially if this were to be used in more complex server-side scenarios.
  // For basic admin tasks, a singleton might seem okay, but this is safer.
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      // It's good practice to disable auto-refresh token for server-side admin client
      // as it typically uses the service_role key which doesn't rely on user sessions.
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Optional: If you need a singleton server client (use with caution, understand implications)
/*
let supabaseAdminClient: SupabaseClient | null = null;

export const getSingletonSupabaseAdmin = (): SupabaseClient => {
  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabaseAdminClient;
};
*/ 