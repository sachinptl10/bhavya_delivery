const request = require('supertest');
const { app, registerAndLogin, makeAdmin, validAddress } = require('./helpers');
const Order = require('../src/models/Order');

const loginAsAdmin = async () => {
  const { agent, user } = await registerAndLogin();
  await makeAdmin(user.email);
  return agent;
};

const createOrder = (agent, weight = 1) =>
  agent.post('/api/orders').send({
    sender: validAddress(),
    receiver: validAddress({ pincode: '400001', city: 'Mumbai', state: 'Maharashtra' }),
    weight
  });

describe('admin authorization', () => {
  it('rejects unauthenticated requests', async () => {
    expect((await request(app).get('/api/admin/orders')).status).toBe(401);
    expect((await request(app).get('/api/admin/stats')).status).toBe(401);
  });

  it('rejects non-admin users', async () => {
    const { agent } = await registerAndLogin();
    expect((await agent.get('/api/admin/orders')).status).toBe(403);
    expect((await agent.get('/api/admin/stats')).status).toBe(403);
  });
});

describe('GET /api/admin/orders (pagination)', () => {
  it('returns paginated orders with metadata', async () => {
    const admin = await loginAsAdmin();
    for (let i = 0; i < 3; i++) await createOrder(admin);

    const res = await admin.get('/api/admin/orders?page=1&limit=2');
    expect(res.status).toBe(200);
    expect(res.body.orders).toHaveLength(2);
    expect(res.body.total).toBe(3);
    expect(res.body.pages).toBe(2);
    expect(res.body.page).toBe(1);

    const page2 = await admin.get('/api/admin/orders?page=2&limit=2');
    expect(page2.body.orders).toHaveLength(1);
  });

  it('clamps a huge limit to the maximum', async () => {
    const admin = await loginAsAdmin();
    const res = await admin.get('/api/admin/orders?limit=99999');
    expect(res.status).toBe(200);
    // limit is capped at 100, so with 0 orders pages is still 1
    expect(res.body.pages).toBe(1);
  });
});

describe('GET /api/admin/stats', () => {
  it('aggregates totals, paid revenue, active deliveries and a 7-day trend', async () => {
    const admin = await loginAsAdmin();
    const { body: o1 } = await createOrder(admin, 1); // price 175 (national)
    const { body: o2 } = await createOrder(admin, 2); // price 225
    await Order.updateOne({ _id: o1._id }, { paymentStatus: 'completed' });
    await Order.updateOne({ _id: o2._id }, { status: 'Delivered' });

    const res = await admin.get('/api/admin/stats');
    expect(res.status).toBe(200);
    expect(res.body.totalOrders).toBe(2);
    expect(res.body.revenue).toBe(o1.price); // only completed payments count
    expect(res.body.activeDeliveries).toBe(1); // o2 delivered, o1 still Booked
    expect(res.body.revenueTrend).toHaveLength(7);
    // Today's bucket carries the paid revenue
    expect(res.body.revenueTrend[6].revenue).toBe(o1.price);
  });
});

describe('PUT /api/admin/orders/:id/status', () => {
  it('updates status and appends to history', async () => {
    const admin = await loginAsAdmin();
    const { body: order } = await createOrder(admin);

    const res = await admin
      .put(`/api/admin/orders/${order._id}/status`)
      .send({ status: 'In Transit' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('In Transit');
    expect(res.body.statusHistory).toHaveLength(2);
  });

  it('rejects an invalid status value', async () => {
    const admin = await loginAsAdmin();
    const { body: order } = await createOrder(admin);

    const res = await admin
      .put(`/api/admin/orders/${order._id}/status`)
      .send({ status: 'Lost In Space' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/health', () => {
  it('reports ok when the DB is connected', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.db).toBe('connected');
  });
});
