/**
 * JWT Authentication Middleware: Verifies JWT tokens from Authorization header
 * Grabs token → Verifies → Sets request.user or 401 error
 *
 * Skip rule: GET/POST comments (remain public)
 * 
 * Used by:
 * POST /api/v1/posts
 * PATCH/DELETE /api/v1/posts/:postId
 * POST/PATCH/DELETE /api/v1/profile
 */


const jwt = require('jsonwebtoken');

const jwtAuth = (request, response, next) => {
  if (request.path.includes('/comments') && request.method !== 'DELETE') { // Skip auth for public GET/POST comments
    return next();
  }
  
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
