/**
 * Comments Routes: Nested under blog posts
 *
 * Handles HTTP endpoints related to post comments:
 * - GET /api/v1/posts/:postId/comments                 : List all comments for a post (public)
 * - POST /api/v1/posts/:postId/comments                : Create a new comment (public)
 * - DELETE /api/v1/posts/:postId/comments/:commentId   : Delete a comment (public - author match)
 *
 * Features:
 * - Public access for viewing, creating comments
 * - Nested under posts using mergeParams
 * - Validates post exists before comment operations
 * - Author string matching for delete ownership
 */

const express = require('express');
const commentAuth = require('../middlewares/commentAuth');
const validatePostExists = require('../middlewares/validatePostExists');
const Comment = require('../models/Comment');

const router = express.Router({ mergeParams: true });

// ========== GET /api/v1/posts/:postId/comments — List all comments for a post (Public) ==========
router.get('/', validatePostExists, async (request, response, next) => {
  try {
    const comments = await Comment.find({ post: request.params.postId }).sort({
      createdAt: -1,
    });

    response.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
});

// ========== POST /api/v1/posts/:postId/comments — Create a new comment (Public) ==========
router.post('/', validatePostExists, async (request, response, next) => {
  try {
    const author = request.user?.username || request.body.author || 'Anonymous';

    const existingComment = await Comment.findOne({
      post: request.params.postId,
      author: author,
      text: request.body.text?.trim(),
    });

    if (existingComment) {
      const error = new Error('This comment already exists!');
      error.status = 409;
      return next(error);
    }

    const comment = await Comment.create({
      post: request.params.postId,
      author: author,
      text: request.body.text,
    });

    response.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
});

// ========== DELETE /api/v1/posts/:postId/comments/:commentId ==========
router.delete('/:commentId', commentAuth, async (request, response, next) => {
  try {
    await Comment.findByIdAndDelete(request.comment._id);

    response.status(200).json({
      success: true,
      message: 'Comment deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
