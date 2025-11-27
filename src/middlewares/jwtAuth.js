const jwt = require('jsonwebtoken');

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

module.exports = jwtAuth;
