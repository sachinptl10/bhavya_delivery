const { app } = require('./helpers');

describe('API documentation', () => {
  it('serves the raw OpenAPI spec', async () => {
    const res = await require('supertest')(app).get('/api/docs.json');
    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe('3.1.0');
    expect(res.body.info.title).toBe('Bhavya Express API');
  });

  it('serves the Swagger UI', async () => {
    const res = await require('supertest')(app).get('/api/docs/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
  });
});
