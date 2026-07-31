const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const razorpayConfigured = () =>
  Boolean(
    process.env.RAZORPAY_KEY_ID &&
    process.env.RAZORPAY_KEY_SECRET &&
    process.env.RAZORPAY_KEY_ID !== 'your_razorpay_key_id_here'
  );

// Mock payments are a dev-only convenience. The server decides — the client
// can never opt into mock mode.
const mockModeEnabled = () =>
  !razorpayConfigured() && process.env.NODE_ENV !== 'production';

// Loads the order and asserts it belongs to the authenticated user.
// Returns null after sending the error response.
const getOwnedOrder = async (orderId, req, res) => {
  const order = await Order.findById(orderId);
  if (!order || order.user.toString() !== req.user.id) {
    res.status(404).json({ message: 'Order not found' });
    return null;
  }
  return order;
};

exports.createPaymentOrder = async (req, res) => {
  const { orderId } = req.body;
  try {
    const order = await getOwnedOrder(orderId, req, res);
    if (!order) return;

    if (order.paymentStatus === 'completed') {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    if (razorpayConfigured()) {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const options = {
        amount: Math.round(order.price * 100), // in paise
        currency: 'INR',
        receipt: order.trackingId,
      };

      const razorpayOrder = await razorpay.orders.create(options);
      order.razorpayOrderId = razorpayOrder.id;
      await order.save();

      res.json({
        mock: false,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      });
    } else if (mockModeEnabled()) {
      res.json({
        mock: true,
        orderId: 'mock_order_' + order._id,
        amount: Math.round(order.price * 100),
      });
    } else {
      res.status(503).json({ message: 'Payments are not configured' });
    }
  } catch (error) {
    console.error('createPaymentOrder:', error);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
};

exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
  try {
    const order = await getOwnedOrder(orderId, req, res);
    if (!order) return;

    if (order.paymentStatus === 'completed') {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    if (razorpayConfigured()) {
      // The Razorpay order must be the one we created for this order.
      if (!razorpay_order_id || razorpay_order_id !== order.razorpayOrderId) {
        return res.status(400).json({ success: false, message: 'Payment verification failed' });
      }

      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
      const generated_signature = hmac.digest('hex');

      if (generated_signature === razorpay_signature) {
        order.paymentStatus = 'completed';
        order.razorpayPaymentId = razorpay_payment_id;
        await order.save();
        res.json({ success: true, message: 'Payment verified successfully' });
      } else {
        res.status(400).json({ success: false, message: 'Payment verification failed' });
      }
    } else if (mockModeEnabled()) {
      order.paymentStatus = 'completed';
      await order.save();
      res.json({ success: true, message: 'Mock payment successful' });
    } else {
      res.status(503).json({ message: 'Payments are not configured' });
    }
  } catch (error) {
    console.error('verifyPayment:', error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
};
