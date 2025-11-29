/**
 * Validate Post Exists Middleware
 *
 * Validates that a post exists by ID before nested operations:
 * 1. Finds post by req.params.postId
 * 2. Returns 404 if post not found
 * 3. Attaches post to req.post for route handlers
 * 4. Continues to next middleware/route
 */

const Post = require('../models/Post');

const validatePostExists = async (request, response, next) => {
  try {
    const post = await Post.findById(request.params.postId);
    if (!post) {
      const error = new Error('Post not found.');
      error.status = 404;
      return next(error);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validatePostExists;