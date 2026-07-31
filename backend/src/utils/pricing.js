const Pincode = require('../models/Pincode');

// Rate logic: Price = (₹50 base + weight_kg × ₹20) × zone multiplier
// Local: x1, Regional: x1.5, National: x2.5
const ZONE_MULTIPLIERS = { local: 1, regional: 1.5, national: 2.5 };

// Derives the delivery zone from the sender/receiver pincode pair.
// Same pincode → local; same state (per Pincode DB) or same 2-digit PIN
// prefix → regional; otherwise national. Never trusts a client-sent zone.
const deriveZone = async (senderPincode, receiverPincode) => {
  if (senderPincode === receiverPincode) return 'local';

  const [from, to] = await Promise.all([
    Pincode.findOne({ pincode: senderPincode }),
    Pincode.findOne({ pincode: receiverPincode })
  ]);

  if (from && to) {
    return from.state === to.state ? 'regional' : 'national';
  }

  // Fallback for pincodes not in the serviceability table: the first two
  // digits of an Indian PIN identify the postal region.
  return senderPincode.substring(0, 2) === receiverPincode.substring(0, 2)
    ? 'regional'
    : 'national';
};

const calculatePrice = (weight, zone) => {
  const base = 50;
  const weightCharge = weight * 20;
  return Math.round((base + weightCharge) * ZONE_MULTIPLIERS[zone] * 100) / 100;
};

module.exports = { deriveZone, calculatePrice, ZONE_MULTIPLIERS };
