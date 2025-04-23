require('dotenv').config({ path: '../../.env' }); // Ensure .env is loaded relative to project root
    const { createClient } = require('@supabase/supabase-js');

    // Check if Supabase URL and Key are set
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file');
      process.exit(1); // Exit the process with an error code
    }

    // Initialize and export Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    module.exports = { supabase };
