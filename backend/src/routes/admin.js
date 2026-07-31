const express = require('express');
const router = express.Router();
const { getAllOrders, updateOrderStatus, getDashboardStats } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');
const { validate, orderStatusSchema } = require('../middlewares/validate');

router.get('/orders', protect, isAdmin, getAllOrders);
router.put('/orders/:id/status', protect, isAdmin, validate(orderStatusSchema), updateOrderStatus);
router.get('/stats', protect, isAdmin, getDashboardStats);

module.exports = router;
