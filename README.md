# Bloggy-API
A simple mutli-user, headless Content Management System (CMS) backend built with Node.js, Express, and MongoDB. Bloggy-API enables authenticated users to manage their blog posts and profiles through a RESTful API.

*Bloggy-API provides RESTful endpoints to create, read, update, delete posts and comments with authentication.*

**Tech Stack:** Node.js · Express · MongoDB · Mongoose · JWT
<hr>

**Live Demo:** https://bloggy-api-18dl.onrender.com
<hr>

## API Features
- **RESTful endpoints** for auth, posts, profiles, comments  
- **JSON** - simple, predictable data formats  
- **Developer-first** design with clean routes, validation, security  
- **Production-ready** - Rate limiting, CORS, helmet, error handling  
- **JWT Authentication** + Guest comments with author verification

## Table of Contents
- [Target Audience / User Stories](#target-audience--user-stories)
- [Quick Setup (30 seconds)](#-quick-setup-30-seconds)
- [Hardware Requirements](#hardware-requirements)
- [Dependencies](#dependencies)
- [Database Models](#database-models)
- [API Endpoints](#api-endpoints)
- [MVP Features](#mvp-features)

## Target Audience / User Stories

**Developers:** Building web or mobile apps that need a backend for blogging.  

**Bloggers:** Programmatically managing posts, comments, and user profiles. 

**Startups & agencies:** Creating tools for content management and social features.

## Quick Set Up

1. Clone repo
```
git clone https://github.com/lillieharlow/Bloggy-API.git
cd Bloggy-API
code Bloggy-API
```
2. Install dependencies `npm install`.
4. Create `.env` file. Example:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bloggy
JWT_SECRET=yoursecretkeygoeshere
```
5. Start server `npm start`.


## Hardware Requirements
[](https://github.com/lillieharlow/Bloggy-API#hardware-requirements)
- **Minimum:** 1 CPU, 1 GB RAM  
- **Recommended:** 2+ CPU, 2 GB RAM  

## Dependencies
[](https://github.com/lillieharlow/Bloggy-API#dependencies)

| Library | Purpose |
|---------|---------|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `jsonwebtoken` | JWT authentication |
| `bcryptjs` | Password hashing |
| `express-rate-limit` | Rate limiting |
| `helmet` | Security headers |
| `cors` | Cross-origin |
| `express-validator` | Request validation |
| `validator.js` | String validation/sanitization |

**Notes:** `package.json` includes dev dependencies, these are not installed with `npm install`.

### Purpose of Key Dependencies
[](https://github.com/lillieharlow/Bloggy-API#purpose-of-key-dependencies)
- **App wiring:** Express, Mongoose  
- **Auth/Security:** JWT, bcrypt, helmet, rate-limit  
- **Validation:** Custom middleware  
- **Production:** CORS, JSON parsing  

### Security Impact
[](https://github.com/lillieharlow/Bloggy-API#security-impact)
- Environment variables for secrets (never commit `.env`)  
- JWT tokens with expiration  
- Rate limiting prevents DDoS attacks, spam comments, API Abuse   
- Helmet + CORS security headers  

## API Endpoints
[](https://github.com/lillieharlow/Bloggy-API#api-endpoints)
**Local Base URL:** `http://localhost:3000`
**Deployed Base URL:** `https://bloggy-api-18dl.onrender.com`

### Auth (/api/v1/auth)
| Method | Full Endpoint | Auth | Description |
|--------|---------------|------|-------------|
| `POST` | `/api/v1/auth/register` | - | Create account |
| `POST` | `/api/v1/auth/login` | - | JWT login |

### Profile (/api/v1/profile)
| Method | Full Endpoint | Auth | Description |
|--------|---------------|------|-------------|
| `GET` | `/api/v1/profile/:id` | - | View profile (public) |
| `POST` | `/api/v1/profile` | ✅ | Create profile |
| `PATCH` | `/api/v1/profile` | ✅ | Update profile |
| `DELETE` | `/api/v1/profile` | ✅ | Delete profile |

### Posts (/api/v1/posts)
| Method | Full Endpoint | Auth | Description |
|--------|---------------|------|-------------|
| `GET` | `/api/v1/posts` | - | List all posts |
| `GET` | `/api/v1/posts/profile/:username` | - | Posts by user |
| `GET` | `/api/v1/posts/:postId` | - | Get single post |
| `POST` | `/api/v1/posts` | ✅ | Create post |
| `PATCH` | `/api/v1/posts/:postId` | ✅ | Update post |
| `DELETE` | `/api/v1/posts/:postId` | ✅ | Delete post |

### Comments (/api/v1/posts/:postId/comments)
| Method | Full Endpoint | Auth | Description |
|--------|---------------|------|-------------|
| `GET` | `/api/v1/posts/:postId/comments` | - | List comments |
| `POST` | `/api/v1/posts/:postId/comments` | - | Add comment (guest OK) |
| `DELETE` | `/api/v1/posts/:postId/comments/:commentId` | Author | Delete comment |

## MVP Features
[](https://github.com/lillieharlow/Bloggy-API#mvp-features)

**Public:**
- Register/login
- View all posts
- View posts by user  
- View single post
- View user profile
- View/add comments

**User (auth required):**
- Create, update and delete posts
- Create, update and delete profile
- Delete comments (comment auhtor or post author only)