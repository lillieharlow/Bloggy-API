/**
 * Posts Routes: CRUD operations for blog posts
 *
 * Handles HTTP endpoints related to blog posts:
 * - GET /api/v1/posts              : List all posts (public)
 * - GET /api/v1/posts/:postId      : Get a single post by ID (public)
 * - POST /api/v1/posts             : Create a new post (authentication required)
 * - PATCH /api/v1/posts/:postId    : Update an existing post (authentication required)
 * - DELETE /api/v1/posts/:postId   : Delete a post (authentication required)
 *
 * Features:
 * - Public access for viewing posts
 * - Protected routes for creating, updating, deleting posts
 * - Uses JWT authentication middleware on protected routes
 * - Populates author username for posts
 */

const express = require('express');
const auth = require('../middleware/jwtAuth');
const Post = require('../models/Post');
const router = express.Router();

// ========== GET /api/v1/posts — List all posts (Public) ==========
router.get('/', async (request, response, next) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 }); // Newest posts first
    response.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
});

// ========== GET /api/v1/posts/:postId — Get a single post by ID (Public) ==========
router.get('/:postId', async (request, response, next) => {
  try {
    const post = await Post.findById(request.params.postId).populate(
      'author',
      'username'
    );
    if (!post) {
      const error = new Error('Post not found.');
      error.status = 404;
      return next(error);
    }

    response.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
});

router.use(auth);

// ========== POST /api/v1/posts — Create new post (Auth required) ==========
// router.post('/', async (request, response, next) => {});

// ========== PATCH /api/v1/posts/:postId — Update existing post (Auth required) ==========
// router.patch('/:postId', async (request, response, next) => {});

// ========== DELETE /api/v1/posts/:postId — Delete post (Auth required) ==========
// router.delete('/:postId', async (request, response, next) => {});

module.exports = router;
