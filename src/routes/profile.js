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
router.post('/', async (request, response, next) => {
  try {
    const user = await User.findById(request.user.id);

    if (user.profile) {
      const error = new Error('Profile already exists. Use PATCH to update.');
      error.status = 400;
      return next(error);
    }

    user.profile = request.body.profile;
    await user.save();

    response.status(201).json({
      success: true,
      data: user.profile,
    });
  } catch (error) {
    next(error);
  }
});

// ========== PATCH /api/v1/profile/:id — Update profile info (Auth required) ==========
router.patch('/:id', async (request, response, next) => {
  try {
    const user = await User.findOne({
      _id: request.params.id,
      _id: request.user.id, // Ensure user can only update their own profile
    });

    if (!user) {
      const error = new Error('Profile not found / not authorized to make changes');
      error.status = 404;
      return next(error);
    }

    if (!user.profile) {
      const error = new Error('Profile does not exist. Use POST to create one.');
      error.status = 400;
      return next(error);
    }

    Object.assign(user.profile, request.body.profile);
    await user.save();

    response.status(200).json({
      success: true,
      data: user.profile,
    });
  } catch (error) {
    next(error);
  }
});

// ========== DELETE /api/v1/profile/:id — Delete profile info (Auth required) ==========
router.delete('/:id', async (request, response, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: request.params.id, _id: request.user.id }, // Ensure user can only delete their own profile
      { $unset: { profile: 1 } }, // Remove embedded profile
      { new: true }
    );

    if (!user) {
      const error = new Error('Profile not found / not authorized to delete.');
      error.status = 404;
      return next(error);
    }

    response.status(200).json({
      success: true,
      message: 'Profile deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;