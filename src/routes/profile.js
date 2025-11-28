/**
 * Profile Routes: CRUD operations for user profile information
 *
 * Handles HTTP endpoints related to user profile info:
 * - GET /api/v1/profile/:id       : View one profile by ID (public)
 * - POST /api/v1/profile          : Create profile info (authentication required)
 * - PATCH /api/v1/profile/:id     : Update profile info (authentication required)
 * - DELETE /api/v1/profile/:id    : Delete profile info (authentication required)
 *
 * Features:
 * - Public access to view profile info
 * - Protected routes for creating, updating, deleting profile info
 * - Secured using JWT authentication middleware where applicable
 */

const express = require('express');
const auth = require('../middleware/jwtAuth');
const User = require('../models/User');
const router = express.Router();

// ========== GET /api/v1/profile/:id — View one profile by ID (Public) ==========
router.get('/:id', async (request, response, next) => {
  try {
    const user = await User.findById(request.params.id).select(
      'profile username'
    );

    if (!user) {
      const error = new Error('User not found.');
      error.status = 404;
      return next(error);
    }

    if(!user.profile) {
        return response.status(404).json({
            success: true,
            data: null,
            message: `${user.username} has not set up a profile yet.`
        });
    }

    response.status(200).json({
      success: true,
      data: user.profile,
    });
  } catch (error) {
    next(error);
  }
});

router.use(auth);

// ========== POST /api/v1/profile — Create profile info (Auth required) ==========
