/**
 * Auth Routes: User authentication endpoints
 *
 * Handles HTTP endpoints related to user authentication:
 * - POST /api/v1/auth/signup       : Register new user (public)
 * - POST /api/v1/auth/login        : User login (public)
 *
 * Features:
 * - Password hashing with bcryptjs
 * - JWT token generation (3d expiry)
 * - Input validation middleware
 * - Consistent error handling with global handler
 * - Matches Posts/Profile route patterns
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validateSignup = require('../middlewares/validateSignup');

const router = express.Router();

// ========== POST /api/v1/auth/signup — Register new user (Public) ==========
router.post('/signup', ...validateSignup, async (request, response, next) => {
  try {
    const { username, email, password } = request.body;
    const user = new User({ username, email, password });
    await user.save();
    response.status(201).json({
      message: 'User created successfully',
    });
  } catch (error) {
    error.status = 400;
    next(error);
  }
});

// ========== POST /api/v1/auth/login — User login (Public) ==========
router.post('/login', async (request, response, next) => {
  try {
    const { email, password } = request.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const error = new Error('Email required');
      error.status = 401;
      return next(error);
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const error = new Error('Invalid password');
      error.status = 401;
      return next(error);
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      // eslint-disable-next-line no-undef
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );
    response.json({ token });
  } catch (error) {
    error.status = 400;
    next(error);
  }
});

module.exports = router;
