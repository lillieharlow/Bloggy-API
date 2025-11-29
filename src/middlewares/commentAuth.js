/**
 * Comment Authorization Middleware
 * 1. Post owner → Delete ANY comment
 * 2. Guest deleteAuthor match
 */

const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

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

    if (request.user) {
      const post = await Post.findById(postId).select('author');
      if (post?.author.toString() === request.user.userId) {
        request.comment = comment;
        return next();
      }
    }

    if (!request.body.deleteAuthor) {
      const error = new Error('deleteAuthor required');
      error.status = 400;
      return next(error);
    }

    if (request.body.deleteAuthor !== comment.author) {
      const error = new Error('Name does not match comment author');
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