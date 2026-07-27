const express = require('express');
const router = express.Router();
const PricingTier = require('../models/PricingTier');
const { protect, admin } = require('../middlewares/authMiddleware');

// @route   GET /api/pricing-tiers
// @desc    Get all pricing tiers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const tiers = await PricingTier.find().sort({ order: 1 });
    res.json(tiers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/pricing-tiers/:id
// @desc    Update a pricing tier
// @access  Private/Admin
router.put('/:id', [protect, admin], async (req, res) => {
  try {
    const { basePrice, deliveryTime, features, isPopular } = req.body;
    
    // Optionally reset other tiers if this one is set to popular
    if (isPopular) {
      await PricingTier.updateMany(
        { _id: { $ne: req.params.id } },
        { isPopular: false }
      );
    }

    const tier = await PricingTier.findByIdAndUpdate(
      req.params.id,
      { $set: { basePrice, deliveryTime, features, isPopular } },
      { new: true }
    );

    if (!tier) {
      return res.status(404).json({ msg: 'Pricing tier not found' });
    }

    res.json(tier);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Pricing tier not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
