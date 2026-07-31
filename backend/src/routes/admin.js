const express = require('express');
const router = express.Router();
const { getAllOrders, updateOrderStatus, getDashboardStats } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

router.get('/orders', protect, isAdmin, getAllOrders);
router.put('/orders/:id/status', protect, isAdmin, updateOrderStatus);
router.get('/stats', protect, isAdmin, getDashboardStats);

module.exports = router;
