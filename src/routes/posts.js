/**
 * Posts Routes: CRUD operations for blog posts
 *
 * Handles HTTP endpoints related to blog posts:
 * - GET /api/v1/posts                      : List all posts (public)
 * - GET /api/v1/posts/profile/:username    : Get all posts by a specific username (public)
 * - GET /api/v1/posts/:postId              : Get a single post by ID (public)
 * - POST /api/v1/posts                     : Create a new post (authentication required)
 * - PATCH /api/v1/posts/:postId            : Update an existing post (authentication required)
 * - DELETE /api/v1/posts/:postId           : Delete a post (authentication required)
 *
 * Features:
 * - Public access for viewing posts
 * - Protected routes for creating, updating, deleting posts
 * - Uses JWT authentication middleware on protected routes
 * - Populates author username for posts
 */

const express = require('express');
const auth = require('../middlewares/jwtAuth');
const validatePostExists = require('../middlewares/validatePostExists');
const Post = require('../models/Post');
const commentsRoutes = require('./comments');

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

// ========== GET /api/v1/posts/profile/:username — Get all posts by a specific username (Public) ==========
router.get('/profile/:username', async (request, response, next) => {
  // MongoDB doesn't query populated fields (they exist only after population).
  try {
    const allPosts = await Post.find({})
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    const userPosts = allPosts.filter(
      (post) => post.author.username === request.params.username
    );

    response.status(200).json({
      success: true,
      count: userPosts.length,
      username: request.params.username,
      data: userPosts,
    });
  } catch (error) {
    next(error);
  }
});

// ========== GET /api/v1/posts/:postId — Get a single post by ID (Public) ==========
router.get('/:postId', validatePostExists, async (request, response, next) => {
  try {
    const post = await Post.findById(request.params.postId).populate(
      'author',
      'username'
    );

    response.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
});

router.use(auth);

router.use('/:postId/comments', commentsRoutes);

// ========== POST /api/v1/posts — Create new post (Auth required) ==========
router.post('/', async (request, response, next) => {
  try {
    const existingPost = await Post.findOne({
      title: request.body.title.trim(),
      author: request.user.userId,
    });

    if (existingPost) {
      const error = new Error('Post with this title already exists!');
      error.status = 409;
      return next(error);
    }

    const post = await Post.create({
      title: request.body.title,
      body: request.body.body,
      image: request.body.image,
      tags: request.body.tags,
      author: request.user.userId,
    });
    response.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
});

// ========== PATCH /api/v1/posts/:postId — Update existing post (Auth required) ==========
router.patch(
  '/:postId',
  validatePostExists,
  async (request, response, next) => {
    try {
      const post = await Post.findOneAndUpdate(
        { _id: request.params.postId, author: request.user.userId },
        { $set: request.body },
        { new: true, runValidators: true }
      );

      response.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ========== DELETE /api/v1/posts/:postId — Delete post (Auth required) ==========
router.delete(
  '/:postId',
  validatePostExists,
  async (request, response, next) => {
    try {
      await Post.findOneAndDelete({
        _id: request.params.postId,
        author: request.user.userId,
      });

      response.status(200).json({
        success: true,
        message: 'Post deleted successfully!',
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
