// Shared test setup: boots an in-memory MongoDB and points the app at it.
// Required env vars are stubbed before the app is imported.
// Uses vitest globals (globals: true in vitest.config.js) since vitest
// cannot be require()d from CommonJS.
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

process.env.JWT_SECRET = 'test-jwt-secret-that-is-at-least-32-chars-long';
process.env.NODE_ENV = 'test';
delete process.env.RAZORPAY_KEY_ID;
delete process.env.RAZORPAY_KEY_SECRET;

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
  await mongoose.connect(process.env.MONGO_URI);
});

afterEach(async () => {
  // Isolate tests: wipe all collections between tests.
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((c) => c.deleteMany({})));
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});
