require('dotenv').config(); // Keep dotenv config here for PORT etc.
const express = require('express');

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

module.exports = { app }; // Only export app now
