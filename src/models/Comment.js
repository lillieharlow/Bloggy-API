/**
 * Comment Model: Handles comments on blog posts
 * Defines comment schema with:
 * - Reference to the associated blog post
 * - Author info with validation
 * - Comment text content
 */

const mongoose = require('mongoose');
const validator = require('validator');

// ========== Comment Schema ==========
const CommentSchema = mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post reference is required'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      minLength: [5, 'Author name must be at least 5 characters long'],
      maxLength: [50, 'Author name must be at most 50 characters long'],
      validate: {
        validator: (value) =>
          validator.isAlphanumeric(value.replace(/-/g, ''), 'en-US', { ignore: ' ' }),
        message:
          'Author name can only contain alphanumeric characters and dashes',
      },
    },
    text: {
      type: String,
      required: [true, 'Text is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);
