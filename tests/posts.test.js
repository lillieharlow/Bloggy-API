// ========== Testing Posts Routes ==========

/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../src/index');

describe('Posts routes', () => {
  it('POST /api/v1/posts requires auth (401)', async () => {
    const response = await request(app).post('/api/v1/posts').send({ title: 'Test', body: 'Test' });
    expect(response.status).toBe(401);
  }, 5000);

  it('GET /api/v1/posts/invalid returns server error', async () => {
    const response = await request(app).get('/api/v1/posts/invalid');
    expect(response.status).toBe(500);
  }, 5000);

  it('DELETE /api/v1/posts/invalid requires auth', async () => {
    const response = await request(app).delete('/api/v1/posts/invalid');
    expect(response.status).toBe(401);
  }, 5000);
});
