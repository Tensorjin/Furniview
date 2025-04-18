require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

// Check if Supabase URL and Key are set
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file');
  process.exit(1); // Exit the process with an error code
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001; // Use environment variable or default to 3001

// Middleware
app.use(express.json()); // For parsing application/json

// Basic Routes
app.get('/', (req, res) => {
  res.send('Furniview Backend is running!');
});

// API Routes
const authRoutes = require('./src/routes/auth');
const furnitureRoutes = require('./src/routes/furniture');
const uploadRoutes = require('./src/routes/upload'); // Added upload routes

app.use('/api/auth', authRoutes);
app.use('/api/furniture', furnitureRoutes);
app.use('/api/upload', uploadRoutes); // Added upload routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = { app, supabase }; // Export for potential testing or extension
