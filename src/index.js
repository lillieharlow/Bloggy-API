/**
 * Bloggy API Server - Main Entry Point
 *
 * Features:
 * - Security (helmet, cors, rate-limit)
 * - JSON parsing + validation
 * - Auto-mounted API routes
 * - Global error handling
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const globalErrorHandler = require('./middlewares/globalErrorHandler');

const authRouter = require('./routes/auth');
const utilsRoutes = require('./routes/utilsRoutes');
const postsRouter = require('./routes/posts');
const profileRouter = require('./routes/profile');
const commentsRouter = require('./routes/comments');

const app = express();

app.use(require('helmet')());
app.use(require('cors')({ origin: ['http://localhost:3000'], optionsSuccessStatus: 200 })); // Add render URL when deployed
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests from this IP' },
});
app.use(limiter);

const mountRoutes = (app) => {
  app.use('/api/v1/utils', utilsRoutes);
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/posts', postsRouter);
  app.use('/api/v1/profile', profileRouter);
  app.use('/api/v1/posts/:postId/comments', commentsRouter);
};

mountRoutes(app);

// ========== GET / — API Welcome Message (Public) ==========
router.get('/', (request, response) => {
  response.status(200).json({
    success: true,
    message: 'Hello from Bloggy-API!',
    version: '1.0.0',
  });
});

app.use(globalErrorHandler);

module.exports = app;
