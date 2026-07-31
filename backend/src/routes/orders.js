const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderByTrackingId, getQuote } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');
const { trackingLimiter } = require('../middlewares/rateLimiters');

router.post('/', protect, createOrder);
router.post('/quote', getQuote); // Public: price preview before login
router.get('/', protect, getUserOrders);
router.get('/track/:trackingId', trackingLimiter, getOrderByTrackingId); // Public tracking

module.exports = router;
