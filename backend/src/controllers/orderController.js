const Order = require('../models/Order');

// Rate logic: Price = ₹50 base + (weight_kg × ₹20) + distance_tier_multiplier
// Local: x1, Regional: x1.5, National: x2.5
const calculatePrice = (weight, zone) => {
  const base = 50;
  const weightCharge = weight * 20;
  let multiplier = 1;
  if (zone === 'regional') multiplier = 1.5;
  if (zone === 'national') multiplier = 2.5;
  
  return (base + weightCharge) * multiplier;
};

const generateTrackingId = () => {
  return 'BHV' + Math.floor(10000000 + Math.random() * 90000000).toString();
};

exports.createOrder = async (req, res) => {
  const { sender, receiver, weight, zone } = req.body;
  try {
    const price = calculatePrice(weight, zone);
    const trackingId = generateTrackingId();

    const order = await Order.create({
      trackingId,
      user: req.user.id,
      sender,
      receiver,
      weight,
      zone,
      price,
      status: 'Booked',
      statusHistory: [{ status: 'Booked' }]
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderByTrackingId = async (req, res) => {
  try {
    const order = await Order.findOne({ trackingId: req.params.trackingId });
    if (order) {
      // Tracking is public, so expose only shipment progress and coarse
      // route info (city/state) — never names, addresses, or phones.
      res.json({
        trackingId: order.trackingId,
        status: order.status,
        statusHistory: order.statusHistory,
        createdAt: order.createdAt,
        sender: { city: order.sender.city, state: order.sender.state },
        receiver: { city: order.receiver.city, state: order.receiver.state }
      });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('getOrderByTrackingId:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};
