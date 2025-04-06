require('dotenv').config(); // Ensure environment variables are loaded
const { createClient } = require('@supabase/supabase-js');

// Ensure required environment variables are present
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in the .env file for service client initialization.');
  // Optionally throw an error or exit, depending on desired behavior if keys are missing
  // process.exit(1);
}

let serviceSupabaseClient = null;
let anonSupabaseClient = null;

/**
 * Initializes and returns a Supabase client instance using the Service Role Key.
 * This client should be used for backend operations requiring elevated privileges.
 * It's implemented as a singleton to avoid creating multiple clients.
 * @returns {SupabaseClient} The initialized Supabase client instance.
 */
const getServiceSupabase = () => {
  if (!serviceSupabaseClient) {
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      // This check is redundant if the top-level check exits/throws,
      // but good practice if the top-level check only logs a warning.
      throw new Error('Supabase URL or Service Role Key is missing. Cannot initialize service client.');
    }
    console.log('Initializing Supabase service client...');
    serviceSupabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            // It's generally recommended to disable auto-refresh for service roles
            // as they don't rely on user sessions.
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false
        }
    });
  }
  return serviceSupabaseClient;
};

/**
 * Initializes and returns a Supabase client instance using the Anon Key.
 * This client should be used for operations allowed for anonymous or authenticated users
 * based on RLS policies (typically read operations).
 * It's implemented as a singleton.
 * @returns {SupabaseClient} The initialized Supabase client instance.
 */
const getAnonSupabase = () => {
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Get anon key too
    if (!anonSupabaseClient) {
        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('Supabase URL or Anon Key is missing. Cannot initialize anon client.');
        }
        console.log('Initializing Supabase anon client...');
        anonSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    }
    return anonSupabaseClient;
};


module.exports = { getServiceSupabase, getAnonSupabase };
