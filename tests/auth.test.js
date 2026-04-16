// ========== Auth Route Tests ==========
// Covers:
// - POST /api/v1/auth/login succeeds for a registered user
// - POST /api/v1/auth/signup rejects duplicate email

jest.setTimeout(20000);

const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/index');
const User = require('../src/models/User');
const Post = require('../src/models/Post');
const { buildUniqueUser, BASE_TEST_DB_URI, buildSuiteDbUri } = require('./utils');

const TEST_DB_URI = buildSuiteDbUri(BASE_TEST_DB_URI, 'auth');

describe('Auth routes', () => {
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

  it('POST /api/v1/auth/login succeeds for a registered user', async () => {
    const user = buildUniqueUser();

    await request(app).post('/api/v1/auth/signup').send(user).expect(201);

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: user.password });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  }, 10000);

  it('POST /api/v1/auth/signup rejects duplicate email', async () => {
    const firstUser = buildUniqueUser();
    const secondUser = {
      ...buildUniqueUser(),
      username: `${firstUser.username}_second`,
      email: firstUser.email,
    };

    await request(app).post('/api/v1/auth/signup').send(firstUser).expect(201);

    const duplicateSignup = await request(app)
      .post('/api/v1/auth/signup')
      .send(secondUser);

    expect(duplicateSignup.status).toBe(400);
    expect(duplicateSignup.body.success).toBe(false);
  }, 10000);
});
