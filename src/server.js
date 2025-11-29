/**
 * Bloggy API Server Entry Point
 *
 * Starts MongoDB connection + Express server
 * Handles graceful startup/shutdown
 *
 * Environment:
 * - PORT: Render auto-assigns (10000+)
 * - MONGODB_URI: MongoDB Atlas connection string
 * - Local dev: mongodb://localhost:27017/bloggy
 *
 * Usage: npm run dev → node --watch src/server.js
 */

const mongoose = require('mongoose');
const app = require('./index.js');


// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3000;
// eslint-disable-next-line no-undef
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bloggy';

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to Database!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Database connection error:', err);
  }
};

startServer();