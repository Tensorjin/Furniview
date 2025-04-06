import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
// Vite uses import.meta.env for environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Error: Supabase URL or Anon Key is missing. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined in your .env file.'
  );
  // In a real app, you might want to throw an error or display a message
}

// Create and export the Supabase client instance
// The Supabase client handles session management automatically (localStorage)
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

// Note: The '!' non-null assertion operator is used here because we assume
// the environment variables will be present in a correctly configured setup.
// Proper error handling might be needed for production.
