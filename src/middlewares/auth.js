const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

/* JWT Authentication Middleware for:
- POST /api/v1/posts
- PATCH /api/v1/posts/:postId
- DELETE /api/v1/posts/:postId
- POST /api/v1/about
- PATCH /api/v1/about/:id
- DELETE /api/v1/about/:id
- DELETE /api/v1/posts/:postId/comments/:commentId*/

const jwtAuth = (request, response, next) => {
  const header = request.headers['authorization'];
  if (!header) return response.status(401).json({ error: 'Missing token' });

  const token = header.split(' ')[1];
  try {
    // eslint-disable-next-line no-undef
    request.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    response.status(401).json({ error: 'Invalid token' });
  }
};

/* Validation Middleware for:
- POST /api/v1/auth/signup
- PATCH /api/v1/about/:id */

const validateSignup = [
  body('username').isString().withMessage('Username required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed'); // Create a new error object
      error.status = 400;
      error.errors = errors.array();
      return next(error); // Pass error to Global Error Handler
    }
    next();
  },
];

module.exports = { jwtAuth, validateSignup };
