const express = require('express');
const router = express.Router();
const { checkServiceability, getAllPincodes } = require('../controllers/pincodeController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/:pincode', checkServiceability);
router.get('/', protect, admin, getAllPincodes);

module.exports = router;
