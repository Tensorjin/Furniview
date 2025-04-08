require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const uploadRoutes = require('./routes/upload'); // Import upload routes
const furnitureRoutes = require('./routes/furniture'); // Import furniture routes
const authRoutes = require('./routes/auth'); // Import auth routes
const companyRoutes = require('./routes/company'); // Import company routes
const { requireAuth } = require('./middleware/authMiddleware'); // Import auth middleware

// Check for Supabase environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Used for client-side/anon access if needed

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_ANON_KEY must be defined in the .env file');
  process.exit(1); // Exit if keys are missing
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const app = express();
const port = process.env.PORT || 3001; // Render provides the PORT env var

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173', // Local Vite dev server
    'https://furniview.vercel.app' // Your deployed Vercel frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Middleware
app.use(cors(corsOptions)); // Use configured CORS
app.use(express.json()); // Parse JSON request bodies

// Basic route
app.get('/', (req, res) => {
  res.send('Furniview Backend is running!');
});

// API Routes
// Public routes (like furniture list/details and auth endpoints) don't need requireAuth here
app.use('/api/auth', authRoutes); // Public auth routes
app.use('/api/furniture', furnitureRoutes); // Public furniture routes

// Protected routes - apply requireAuth middleware *before* the route handler
app.use('/api/upload', requireAuth, uploadRoutes);
app.use('/api/companies', requireAuth, companyRoutes); // Company routes are protected


// Start the server


// Start the server

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app; // Export for potential testing
