# Bloggy-API
A simple mutli-user CMS backend built with Node.js, Express, and MongoDB. Bloggy-API enables authenticated users to manage their blog posts and profiles through a RESTful API.
<hr>

### Project problem:

Managing a personal blog shouldn't require complex platforms. Bloggy-API provides a lightweight, deployable CMS for posts and author profiles with full authentication support.
<hr>

### Database Models:

#### User:
    username — string
    email — string
    password — string
    timestanp - true (created at / updated at)
    profile (optional)
        bio — string (optional)
        profileImage — string (optional)
        socialLinks — object (Twitter, LinkedIn, GitHub) (optional)

#### Post:
    title — string
    body — string
    image — string (optional)
    tags — array of strings (optional)
    author — reference to User
    timestanp - true (created at / updated at)

#### Comment: (for nested routes)
    post — reference to Post
    author — string
    text — string
    timestanp - true (created at / updated at)
<hr>

### API Endpoints

#### Auth:
- POST /api/v1/auth/register — register user

- POST /api/v1/auth/login — login and receive JWT

#### User(profile):
- GET /api/v1/profile/:id — view one profile page (public)

- POST /api/v1/profile — create profile info (auth required)

- PATCH /api/v1/profile — update profile info (auth required)

- DELETE /api/v1/profile — delete profile info (auth required)

#### Posts:
- GET /api/v1/posts — list all posts (public)

- GET /api/v1/posts/profile/:username - list all posts by a user (public)

- GET /api/v1/posts/:postId — get a single post (public)

- POST /api/v1/posts — create post (auth required)

- PATCH /api/v1/posts/:postId — update post (auth required)

- DELETE /api/v1/posts/:postId — delete post (auth required)

#### Comments (nested under posts):
- GET /api/v1/posts/:postId/comments — list comments

- POST /api/v1/posts/:postId/comments — add comment

- DELETE /api/v1/posts/:postId/comments/:commentId — delete comment (auth required)
<hr>

### MVP Features

#### Public
- View all posts

- View all posts by one user

- View a single post

- View a single user profile

- View, create a comment

#### User (auth required)
- Register / login

- Create, update, delete posts

- Create, update, delete profile page

- Delete comments