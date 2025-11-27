# Bloggy-API
Bloggy-API is a simple personal CMS backend built with Node.js, Express, and MongoDB that enables authenticated users to manage blog posts through a RESTful API.
<hr>

### Project problem:

- I want a simple way to manage my personal blog — posts, about page — without relying on complex platforms like WordPress.
<hr>

### Database Models:

#### User:
    username — string
    email — string
    passwordHash — string
    createdAt updatedAt — date (timestamps)
    about
        bio — string
        profileImage — string
        socialLinks — object (Twitter, LinkedIn, GitHub)

#### BlogPost:
    title — string
    body — string
    image — string (optional)
    tags — array of strings (optional)
    author — reference to User
    createdAt updatedAt — date (timestamps)

#### Comment: (for nested routes)
    post — reference to BlogPost
    author — string
    text — string
<hr>

### API Endpoints

Auth:
- POST /api/v1/auth/register — register user (optional for personal blog)

- POST /api/v1/auth/login — login and receive JWT

Blog Posts:
- GET /api/v1/posts — list all posts (public)

- GET /api/v1/posts/:postId — get a single post (public)

- POST /api/v1/posts — create post (auth required)

- PATCH /api/v1/posts/:postId — update post (auth required)

- DELETE /api/v1/posts/:postId — delete post (auth required)

Comments (nested under posts):
- GET /api/v1/posts/:postId/comments — list comments

- POST /api/v1/posts/:postId/comments — add comment

- DELETE /api/v1/posts/:postId/comments/:commentId — delete comment (auth required)

About:
- GET /api/v1/about — view About page (public)

- POST /api/v1/about — create About info (auth required)

- PATCH /api/v1/about/:id — update About info (auth required)

- DELETE /api/v1/about/:id — delete About info (auth required)
<hr>

### MVP Features

#### Public
- View all posts

- View single post

- View About page

#### User (auth required)
- Register / login

- Create, update, delete posts

- Create, update, delete About page