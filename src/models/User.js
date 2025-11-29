/**
 * User Model: Handles user authentication, profiles, and related data
 * Defines user schema with:
 * - Core authentication fields (username, email, password)
 * - Nested profile subdocument for user profiles
 * - Password hashing middleware
 * - JSON transformation for security
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// ========== Profile Sub-Schema =========
const ProfileSchema = mongoose.Schema({
  bio: {
    type: String,
    maxLength: [500, 'Bio cannot exceed 500 characters'],
  },
  profileImage: {
    type: String,
    validate: {
      validator: function (value) {
        if (!value) return true;
        return (
          validator.isURL(value, { require_protocol: true }) &&
          /\.(jpg|jpeg|png|gif|bmp)$/i.test(value)
        );
      },
      message: 'Invalid image URL',
    },
  },
  socialLinks: {
    twitter: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || validator.isURL(v);
        },
        message: 'Invalid Twitter URL',
      },
    },
    linkedin: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || validator.isURL(v);
        },
        message: 'Invalid LinkedIn URL',
      },
    },
    github: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || validator.isURL(v);
        },
        message: 'Invalid GitHub URL',
      },
    },
  },
});

// ========== User Schema ==========
const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: [true, 'Username already in use'],
      minlength: [6, 'Username must be at least 6 characters long'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email already in use'],
      validate: {
        validator: validator.isEmail,
        message: 'Invalid email format',
      },
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    profile: ProfileSchema,
  },
  { timestamps: true }
);

// ========== Password Hashing ==========
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ========== JSON Transformation ==========
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model('User', UserSchema);
