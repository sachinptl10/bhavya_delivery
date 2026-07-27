const mongoose = require('mongoose');

const pricingTierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  deliveryTime: {
    type: String,
    required: true,
  },
  features: [{
    type: String
  }],
  icon: {
    type: String,
    required: true,
    enum: ['MapPin', 'Truck', 'Globe']
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('PricingTier', pricingTierSchema);
