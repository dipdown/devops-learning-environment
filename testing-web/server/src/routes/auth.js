const express = require('express');
const { register, login, getCurrentUser } = require('../controllers/auth');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Register new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get current user (protected route)
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
