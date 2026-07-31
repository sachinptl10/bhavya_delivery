const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderByTrackingId, getQuote } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');
const { trackingLimiter } = require('../middlewares/rateLimiters');
const { validate, createOrderSchema, quoteSchema } = require('../middlewares/validate');

router.post('/', protect, validate(createOrderSchema), createOrder);
router.post('/quote', validate(quoteSchema), getQuote); // Public: price preview before login
router.get('/', protect, getUserOrders);
router.get('/track/:trackingId', trackingLimiter, getOrderByTrackingId); // Public tracking

module.exports = router;
