const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

exports.createPaymentOrder = async (req, res) => {
  const { orderId } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_ID !== 'your_razorpay_key_id_here') {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const options = {
        amount: order.price * 100, // in paise
        currency: 'INR',
        receipt: order.trackingId,
      };

      const razorpayOrder = await razorpay.orders.create(options);
      res.json({
        mock: false,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      });
    } else {
      // Mock flow fallback
      res.json({
        mock: true,
        orderId: 'mock_order_' + Date.now(),
        amount: order.price * 100,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, mock } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (mock) {
      order.paymentStatus = 'completed';
      await order.save();
      return res.json({ success: true, message: 'Mock payment successful' });
    }

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      order.paymentStatus = 'completed';
      order.razorpayOrderId = razorpay_order_id;
      order.razorpayPaymentId = razorpay_payment_id;
      await order.save();
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
