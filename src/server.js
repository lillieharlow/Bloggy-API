/**
 * Bloggy API Server Entry Point
 *
 * Starts MongoDB connection + Express server
 * Handles graceful startup/shutdown
 *
 * Environment:
 * - PORT: Render auto-assigns (10000+)
 * - MONGODB_URI: MongoDB Atlas connection string
 *
 * Usage: npm run dev → node --watch src/server.js
 */

const mongoose = require('mongoose');
const app = require('./index.js');


const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to Database!');
    app.listen(PORT, '0.0.0.0',() => {
      console.log(`Bloggy-API is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Database connection error:', err);
  }
};

startServer();