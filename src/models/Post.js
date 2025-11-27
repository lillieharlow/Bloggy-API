/**
 * Post Model - Handles blog posts including content, images, tags, and author relationships
 * Defines post schema with:
 * - Title and body content (required with length constraints)
 * - Optional image (URL validated for image formats)
 * - Tags array (max 10, alphanumeric + dashes/underscores)
 * - Author reference (required User ObjectId)
 */

const mongoose = require('mongoose');
const validator = require('validator');

// ========== Post Schema ==========
const PostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      minLength: [5, 'Title must be at least 5 characters long'],
      maxLength: [200, "Title can't be more than 200 characters"],
    },
    body: {
      type: String,
      required: [true, 'Body is required'],
    },
    image: {
      type: String,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return (
            validator.isURL(value, { require_protocol: true }) &&
            /\.(jpg|jpeg|png|gif|bmp)$/i.test(value)
          );
        },
        message: 'Invalid image URL',
      },
    },
    tags: {
      type: [String],
      validate: {
        validator: function (value) {
          if (!value) return true;
          if (!Array.isArray(value)) return false;
          if (value.length > 10) return false;
          return value.every(
            (tag) =>
              typeof tag === 'string' && /^[A-Za-z0-9_-]{1,30}$/.test(tag)
          );
        },
        message:
          'Max 10 tags; a tag can contain letters, numbers, dashes or underscores (1-30 chars).',
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
