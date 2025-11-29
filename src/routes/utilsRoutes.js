/**
 * Utility Routes: Health checks + 404 catcher
 *
 * Handles HTTP endpoints related to API status:
 * - GET /databaseHealth                      : Database connection status (public)
 * - ALL /*                                   : Catch-all 404 for undefined routes (public)
 *
 * Features:
 * - Public health monitoring endpoints
 * - Mongoose database status reporting
 * - Clean 404 responses with attempted path
 */

const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// ========== GET /databaseHealth — Database Status (Public) ==========
router.get('/databaseHealth', (request, response) => {
  response.status(200).json({
    success: true,
    models: mongoose.connection.modelNames(),
    host: mongoose.connection.host || 'Not connected',
  });
});

// ========== ALL /* — Catch-all 404 Handler ==========
router.all(/.*/, (request, response) => {
  response.status(404).json({
    success: false,
    message: 'No route with that path found!',
    attemptedPath: request.path,
  });
});

module.exports = router;
