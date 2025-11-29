/**
 * Global Error Handler Middleware
 * Catches ALL errors → Formats JSON → Logs stack traces
 *
 * Handles:
 * - 405 Method Not Allowed (wrong HTTP methods)
 * - Custom errors (error.status + error.message)
 * - Mongoose ValidationError (field-specific errors)  
 * - Express-validator errors (error.errors array)
 * - Generic 500 server errors
 *
 * Used by: app.use(globalErrorHandler) → LAST in index.js
 */


const globalErrorHandler = ((error, request, response, next) => {
  if (response.headersSent) {
    return next(error);
  }

  if (error.statusCode === 405 || error.message.includes('not allowed')) {
    return response.status(405).json({
      success: false,
      message: `Method ${request.method} Not Allowed for ${request.originalUrl}`,
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'], // Customize per route
    });
  }

  const status = error.status || 500;
  let message = error.message || 'Internal Server Error';
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => ({
      message: err.message,
      param: err.path
    }));

    return response.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors
    });
  }

  if (error.errors && Array.isArray(error.errors)) {
    return response.status(status).json({
      success: false,
      message: message,
      errors: error.errors
    });
  }

  console.error(error.stack);
  response.status(status).json({
    success: false,
    error: message,
    name: error.name
  });
});

module.exports = globalErrorHandler;