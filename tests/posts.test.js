// ========== Posts Route Tests ==========
// Covers:
// - GET /api/v1/posts returns 200 with expected response shape
// - Full post lifecycle: create, retrieve, and delete with auth

jest.setTimeout(20000);

const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/index');
const Post = require('../src/models/Post');
const User = require('../src/models/User');
const { buildUniqueUser, BASE_TEST_DB_URI, buildSuiteDbUri } = require('./utils');

const TEST_DB_URI = buildSuiteDbUri(BASE_TEST_DB_URI, 'posts');

describe('Posts routes', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
    await mongoose.connect(TEST_DB_URI);
  });

  afterEach(async () => {
    await Promise.all([User.deleteMany({}), Post.deleteMany({})]);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('GET /api/v1/posts returns 200', async () => {
    const response = await request(app).get('/api/v1/posts');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  }, 10000);

  it('creates, retrieves, and deletes a post', async () => {
    const user = buildUniqueUser();
    await request(app).post('/api/v1/auth/signup').send(user).expect(201);
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(200);
    const token = loginResponse.body.token;

    const createResponse = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Valid Post Title', body: 'A valid post body for testing.' });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.success).toBe(true);
    expect(createResponse.body.data._id).toBeDefined();

    // Fix for Mongo write propagation delays
    const postId = createResponse.body.data._id;

    let attempts = 0;
    while (attempts < 10) {
      const found = await Post.findById(postId);
      if (found) break;
      await new Promise((r) => setTimeout(r, 50));
      attempts++;
    }
    if (attempts === 10) throw new Error('Post not visible in DB after POST');

    const getResponse = await request(app).get(`/api/v1/posts/${postId}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.success).toBe(true);
    expect(getResponse.body.data._id).toBe(postId);

    const deleteResponse = await request(app)
      .delete(`/api/v1/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.success).toBe(true);

    const deletedPost = await Post.findById(postId);
    expect(deletedPost).toBeNull();
  }, 10000);
});
