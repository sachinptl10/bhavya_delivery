const Order = require('../models/Order');

// Clamp user-supplied pagination params to sane bounds.
const parsePagination = (query, defaultLimit = 20, maxLimit = 100) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
  return { page, limit, skip: (page - 1) * limit };
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const [orders, total] = await Promise.all([
      Order.find({})
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments({})
    ]);
    res.json({ orders, page, pages: Math.ceil(total / limit) || 1, total });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = status;
      order.statusHistory.push({ status });
      await order.save();
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    next(error);
  }
};

const ACTIVE_STATUSES = ['Booked', 'Picked Up', 'In Transit', 'Out for Delivery'];

exports.getDashboardStats = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Single aggregation pass instead of loading every order into memory.
    const [result] = await Order.aggregate([
      {
        $facet: {
          totalOrders: [{ $count: 'count' }],
          revenue: [
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$price' } } }
          ],
          activeDeliveries: [
            { $match: { status: { $in: ACTIVE_STATUSES } } },
            { $count: 'count' }
          ],
          // Daily paid revenue for the last 7 days, for the dashboard chart.
          revenueTrend: [
            { $match: { paymentStatus: 'completed', createdAt: { $gte: sevenDaysAgo } } },
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                revenue: { $sum: '$price' }
              }
            },
            { $sort: { _id: 1 } }
          ]
        }
      }
    ]);

    // Fill missing days with zero so the chart always spans 7 points.
    const trendByDay = Object.fromEntries(
      result.revenueTrend.map((d) => [d._id, d.revenue])
    );
    const revenueTrend = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = day.toISOString().slice(0, 10);
      revenueTrend.push({
        date: key,
        name: day.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: trendByDay[key] || 0
      });
    }

    res.json({
      totalOrders: result.totalOrders[0]?.count || 0,
      revenue: result.revenue[0]?.total || 0,
      activeDeliveries: result.activeDeliveries[0]?.count || 0,
      revenueTrend
    });
  } catch (error) {
    next(error);
  }
};
