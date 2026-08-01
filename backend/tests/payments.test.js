const { registerAndLogin, validAddress } = require('./helpers');
const Order = require('../src/models/Order');

// Razorpay env vars are cleared in setup.js and NODE_ENV=test (not
// production), so the server runs in mock payment mode here.

const createOrder = async (agent) => {
  const res = await agent.post('/api/orders').send({
    sender: validAddress(),
    receiver: validAddress({ pincode: '400001', city: 'Mumbai', state: 'Maharashtra' }),
    weight: 1
  });
  return res.body;
};

describe('POST /api/payments/create', () => {
  it('returns a mock payment order in dev/test without Razorpay keys', async () => {
    const { agent } = await registerAndLogin();
    const order = await createOrder(agent);

    const res = await agent.post('/api/payments/create').send({ orderId: order._id });
    expect(res.status).toBe(200);
    expect(res.body.mock).toBe(true);
    expect(res.body.amount).toBe(Math.round(order.price * 100));
  });

  it("rejects another user's order (IDOR)", async () => {
    const { agent: owner } = await registerAndLogin();
    const { agent: attacker } = await registerAndLogin();
    const order = await createOrder(owner);

    const res = await attacker.post('/api/payments/create').send({ orderId: order._id });
    expect(res.status).toBe(404);
  });

  it('rejects an already-paid order', async () => {
    const { agent } = await registerAndLogin();
    const order = await createOrder(agent);
    await Order.updateOne({ _id: order._id }, { paymentStatus: 'completed' });

    const res = await agent.post('/api/payments/create').send({ orderId: order._id });
    expect(res.status).toBe(400);
  });

  it('requires authentication', async () => {
    const request = require('supertest');
    const { app } = require('./helpers');
    const res = await request(app)
      .post('/api/payments/create')
      .send({ orderId: '0'.repeat(24) });
    expect(res.status).toBe(401);
  });
});

describe('POST /api/payments/verify', () => {
  it('completes a mock payment', async () => {
    const { agent } = await registerAndLogin();
    const order = await createOrder(agent);

    const res = await agent.post('/api/payments/verify').send({ orderId: order._id });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const updated = await Order.findById(order._id);
    expect(updated.paymentStatus).toBe('completed');
  });

  it("rejects verifying another user's order (IDOR)", async () => {
    const { agent: owner } = await registerAndLogin();
    const { agent: attacker } = await registerAndLogin();
    const order = await createOrder(owner);

    const res = await attacker.post('/api/payments/verify').send({ orderId: order._id });
    expect(res.status).toBe(404);

    const unchanged = await Order.findById(order._id);
    expect(unchanged.paymentStatus).toBe('pending');
  });
});
