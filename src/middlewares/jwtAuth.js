/**
 * JWT Authentication Middleware: Verifies JWT tokens from Authorization header
 * Protects routes requiring authenticated users by:
 * - Extracting Bearer token from request header
 * - Verifying token signature with JWT_SECRET
 * - Attaching decoded user data to req.user
 * - Returning 401 for missing/invalid tokens
 * 
 * Routes using this middleware:
 * - POST/PATCH/DELETE /api/v1/posts/*
 * - POST/PATCH/DELETE /api/v1/profile/*
 * - DELETE /api/v1/posts/:postId/comments/:commentId
 */

const jwt = require('jsonwebtoken');

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

module.exports = jwtAuth;
