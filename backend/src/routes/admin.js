const express = require('express');
const router = express.Router();
const { getAllOrders, updateOrderStatus, getDashboardStats } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id/status', protect, admin, updateOrderStatus);
router.get('/stats', protect, admin, getDashboardStats);

module.exports = router;
