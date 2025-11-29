/**
 * User Data Validation Middleware: Validates signup and user profile data
 * Protects routes by validating request body fields:
 * - username: required string
 * - email: valid email format
 * - password: minimum 6 characters
 * - Passes detailed errors to global error handler
 *
 * Used by:
 * - POST /api/v1/auth/signup
 * - PATCH /api/v1/profile/:id
 */

const { body, validationResult } = require('express-validator');

const validateSignup = [
  body('username').isString().withMessage('Username required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),

  (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.status = 400;
      error.errors = errors.array();
      return next(error);
    }
    next();
  },
];

module.exports = validateSignup;
