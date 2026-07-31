const express = require('express');
const router = express.Router();
const { checkServiceability, getAllPincodes } = require('../controllers/pincodeController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

router.get('/:pincode', checkServiceability);
router.get('/', protect, isAdmin, getAllPincodes);

module.exports = router;
