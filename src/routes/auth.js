const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const validateSignup = require("../middlewares/auth");

const router = express.Router();

// Signup route
router.post("/signup", validateSignup, async (request, response, next) => {
  try {
    const { username, email, password } = request.body;
    const user = new User({ username, email, password });
    await user.save();
    response.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    error.status = 400;
    next(error);
  }
});

// Login route
router.post("/login", async (request, response, next) => {
  try {
    const { email, password } = request.body;
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Invalid email");
      error.status = 401;
      return next(error);
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const error = new Error("Invalid password");
      error.status = 401;
      return next(error);
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      // eslint-disable-next-line no-undef
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );
    response.json({ token });
  } catch (error) {
      error.status = 400;
      next(error);
  }
});

module.exports = router;
