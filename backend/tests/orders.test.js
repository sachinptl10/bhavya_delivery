const request = require('supertest');
const { app, registerAndLogin, validAddress } = require('./helpers');

const orderPayload = () => ({
  sender: validAddress(),
  receiver: validAddress({ name: 'Priya Patel', pincode: '400001', city: 'Mumbai', state: 'Maharashtra' }),
  weight: 2
});

describe('POST /api/orders/quote (public)', () => {
  it('returns a server-derived zone and price', async () => {
    const res = await request(app).post('/api/orders/quote').send({
      senderPincode: '110001',
      receiverPincode: '560001',
      weight: 2
    });
    expect(res.status).toBe(200);
    expect(res.body.zone).toBe('national'); // different PIN prefixes
    expect(res.body.price).toBe((50 + 2 * 20) * 2.5); // 225
  });

  it('rejects invalid pincodes', async () => {
    const res = await request(app).post('/api/orders/quote').send({
      senderPincode: 'abc',
      receiverPincode: '400001',
      weight: 2
    });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/orders', () => {
  it('requires authentication', async () => {
    const res = await request(app).post('/api/orders').send(orderPayload());
    expect(res.status).toBe(401);
  });

  it('creates an order with server-derived zone and price', async () => {
    const { agent } = await registerAndLogin();
    const res = await agent.post('/api/orders').send(orderPayload());

    expect(res.status).toBe(201);
    expect(res.body.trackingId).toMatch(/^BHV\d{8}$/);
    expect(res.body.status).toBe('Booked');
    expect(res.body.paymentStatus).toBe('pending');
    expect(res.body.zone).toBe('national');
    expect(res.body.price).toBe(225);
  });

  it('ignores client-sent zone and price', async () => {
    const { agent } = await registerAndLogin();
    const res = await agent.post('/api/orders').send({
      ...orderPayload(),
      zone: 'local',
      price: 1
    });
    expect(res.status).toBe(201);
    expect(res.body.zone).toBe('national');
    expect(res.body.price).toBe(225);
  });
});

describe('GET /api/orders', () => {
  it("returns only the authenticated user's orders", async () => {
    const { agent: agentA } = await registerAndLogin();
    const { agent: agentB } = await registerAndLogin();

    await agentA.post('/api/orders').send(orderPayload());
    await agentB.post('/api/orders').send(orderPayload());

    const res = await agentA.get('/api/orders');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

describe('GET /api/orders/track/:trackingId (public)', () => {
  it('exposes only non-PII fields', async () => {
    const { agent } = await registerAndLogin();
    const { body: order } = await agent.post('/api/orders').send(orderPayload());

    const res = await request(app).get(`/api/orders/track/${order.trackingId}`);
    expect(res.status).toBe(200);
    expect(res.body.trackingId).toBe(order.trackingId);
    expect(res.body.status).toBe('Booked');
    expect(res.body.sender).toEqual({ city: 'New Delhi', state: 'Delhi' });
    expect(res.body.receiver).toEqual({ city: 'Mumbai', state: 'Maharashtra' });
    // PII must never leak on the public endpoint
    expect(res.body.sender.name).toBeUndefined();
    expect(res.body.sender.phone).toBeUndefined();
    expect(res.body.sender.address).toBeUndefined();
    expect(res.body.sender.pincode).toBeUndefined();
    expect(res.body.price).toBeUndefined();
    expect(res.body.user).toBeUndefined();
  });

  it('returns 404 for an unknown tracking id', async () => {
    const res = await request(app).get('/api/orders/track/BHV00000000');
    expect(res.status).toBe(404);
  });
});
