/* eslint-disable no-undef */
const mongoose = require('mongoose');
const app = require('./index.js');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bloggy';

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to Database!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Database connection error:', err);
  }
};

startServer();