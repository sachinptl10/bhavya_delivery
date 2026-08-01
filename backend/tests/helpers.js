// Shared helpers for API tests.
const request = require('supertest');
const app = require('../src/app');

// Registers a user via the API and returns { agent, user } where the agent
// carries the auth cookie for subsequent requests.
const registerAndLogin = async (overrides = {}) => {
  const agent = request.agent(app);
  const body = {
    name: 'Test User',
    email: `user-${Math.random().toString(36).slice(2)}@test.com`,
    phone: '9876543210',
    password: 'password123',
    ...overrides
  };
  const res = await agent.post('/api/auth/register').send(body);
  if (res.status !== 201) {
    throw new Error(`register failed: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return { agent, user: res.body };
};

// Promotes a registered user to admin directly in the DB (there is no
// admin-creation API by design), then re-logs to keep the same cookie.
const makeAdmin = async (email) => {
  const User = require('../src/models/User');
  await User.updateOne({ email }, { role: 'admin' });
};

const validAddress = (overrides = {}) => ({
  name: 'Rahul Sharma',
  phone: '9876543210',
  address: '123 Main Street, Block A',
  pincode: '110001',
  city: 'New Delhi',
  state: 'Delhi',
  ...overrides
});

module.exports = { app, registerAndLogin, makeAdmin, validAddress };
