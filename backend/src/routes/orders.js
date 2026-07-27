const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderByTrackingId } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/track/:trackingId', getOrderByTrackingId); // Public tracking

module.exports = router;
