const express = require('express');
const router = express.Router();
const { createPaymentOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');
const { validate, paymentCreateSchema, paymentVerifySchema } = require('../middlewares/validate');

router.post('/create', protect, validate(paymentCreateSchema), createPaymentOrder);
router.post('/verify', protect, validate(paymentVerifySchema), verifyPayment);

module.exports = router;
