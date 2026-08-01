const request = require('supertest');
const { app, registerAndLogin } = require('./helpers');

describe('POST /api/auth/register', () => {
  it('creates a user and sets an httpOnly auth cookie', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'New User',
      email: 'new@test.com',
      phone: '9876543210',
      password: 'password123'
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'New User', email: 'new@test.com', role: 'user' });
    expect(res.body.password).toBeUndefined();

    const cookie = res.headers['set-cookie']?.[0] || '';
    expect(cookie).toContain('token=');
    expect(cookie.toLowerCase()).toContain('httponly');
  });

  it('rejects duplicate emails', async () => {
    await registerAndLogin({ email: 'dup@test.com' });
    const res = await request(app).post('/api/auth/register').send({
      name: 'Dup User',
      email: 'dup@test.com',
      phone: '9876543210',
      password: 'password123'
    });
    expect(res.status).toBe(400);
  });

  it('rejects invalid input (validation)', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'X', // too short
      email: 'not-an-email',
      phone: '123', // invalid
      password: 'short'
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
  });
});

describe('POST /api/auth/login', () => {
  it('logs in with correct credentials', async () => {
    await registerAndLogin({ email: 'login@test.com', password: 'password123' });
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@test.com',
      password: 'password123'
    });
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('login@test.com');
  });

  it('rejects wrong password', async () => {
    await registerAndLogin({ email: 'wrongpw@test.com', password: 'password123' });
    const res = await request(app).post('/api/auth/login').send({
      email: 'wrongpw@test.com',
      password: 'not-the-password'
    });
    expect(res.status).toBe(401);
  });

  it('rejects unknown user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'ghost@test.com',
      password: 'password123'
    });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('returns the current user when authenticated', async () => {
    const { agent, user } = await registerAndLogin();
    const res = await agent.get('/api/auth/me');
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(user.email);
  });

  it('returns 401 without a session', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
