const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Uncommented

// Auth routes using controller functions
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout); // Note: Logout might not need auth middleware depending on client handling

module.exports = router;
