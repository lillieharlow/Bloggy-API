const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const app = express();

// Security middleware
const helmet = require('helmet');
const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:3000'], // Add render URL when deployed
  optionsSuccessStatus: 200,
};

app.use(helmet());
app.use(cors(corsOptions));

app.use(express.json());

// Rate Limiter - 100 requests per 15 minutes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  message: {
    message: 'Too many requests from this IP, please try again later.'
  }
});

app.use(globalLimiter);

// Add route level middleware mounting here

// Home route
app.get('/', (request, response) => {
  response.json({
    message: 'Hello from Bloggy-API!',
  });
});

// Database health check
app.get('/databaseHealth', (request, response) => {
  response.json({
    models: mongoose.connection.modelNames(),
    host: mongoose.connection.host
  });
});

// Catch all undefined routes
app.all(/.*/, (request, response) => {
  response.status(404).json({
    message: 'No route with that path found!',
    attemptedPath: request.path,
  });
});

// Global Error Handler
app.use((error, request, response, next) => {
  if (response.headersSent) {
    return next(error);
  }
  const status = error.status || 500;
  let message = error.message || 'Internal Server Error';
  if (error.name === 'ValidationError') {
    message = 'Invalid data provided';
  }
  console.error(error.stack);
  response.status(status).json({
    success: false,
    error: message,
    name: error.name
  });
});

module.exports = app;