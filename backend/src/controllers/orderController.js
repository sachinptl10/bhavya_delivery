const Order = require('../models/Order');
const { deriveZone, calculatePrice } = require('../utils/pricing');

const generateTrackingId = () => {
  return 'BHV' + Math.floor(10000000 + Math.random() * 90000000).toString();
};

// Server-side quote: the client sends pincodes + weight, never zone/price.
exports.getQuote = async (req, res) => {
  const { senderPincode, receiverPincode, weight } = req.body;
  try {
    const parsedWeight = parseFloat(weight);
    if (!senderPincode || !receiverPincode || !(parsedWeight > 0)) {
      return res.status(400).json({ message: 'senderPincode, receiverPincode and a positive weight are required' });
    }

    const zone = await deriveZone(String(senderPincode), String(receiverPincode));
    const price = calculatePrice(parsedWeight, zone);
    res.json({ zone, price });
  } catch (error) {
    console.error('getQuote:', error);
    res.status(500).json({ message: 'Failed to calculate quote' });
  }
};

exports.createOrder = async (req, res) => {
  const { sender, receiver, weight } = req.body;
  try {
    const parsedWeight = parseFloat(weight);
    if (!sender?.pincode || !receiver?.pincode || !(parsedWeight > 0)) {
      return res.status(400).json({ message: 'Sender/receiver pincodes and a positive weight are required' });
    }

    // Zone and price are always derived server-side (client input ignored)
    const zone = await deriveZone(String(sender.pincode), String(receiver.pincode));
    const price = calculatePrice(parsedWeight, zone);
    const trackingId = generateTrackingId();

    const order = await Order.create({
      trackingId,
      user: req.user.id,
      sender,
      receiver,
      weight: parsedWeight,
      zone,
      price,
      status: 'Booked',
      statusHistory: [{ status: 'Booked' }]
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('createOrder:', error);
    res.status(500).json({ message: 'Failed to create order' });
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
