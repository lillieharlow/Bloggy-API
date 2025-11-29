/**
 * Comment Authorization Middleware
 *
 * Checks ownership for comment deletion/editing:
 * 1. JWT users: Matches req.user.username === comment.author
 * 2. Guest users: Matches req.body.deleteAuthor === comment.author
 * 3. Blocks unauthorized access
 */

const mongoose = require('mongoose');
const Comment = require('../models/Comment');

const commentAuth = async (request, response, next) => {
  try {
    const { postId, commentId } = request.params;

    const comment = await Comment.findOne({
      _id: new mongoose.Types.ObjectId(commentId),
      post: postId,
    });

    if (!comment) {
      const error = new Error('Comment not found.');
      error.status = 404;
      return next(error);
    }

    const isJwtOwner = request.user && request.user.username === comment.author;
    const isGuestOwner = request.body.deleteAuthor === comment.author;

    if (!isJwtOwner && !isGuestOwner) {
      const error = new Error('Not authorized to delete this comment.');
      error.status = 403;
      return next(error);
    }

    request.comment = comment;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = commentAuth;
