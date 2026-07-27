const mongoose = require('mongoose');

const pincodeSchema = new mongoose.Schema({
  pincode: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zone: { type: String, enum: ['local', 'regional', 'national'], required: true, default: 'local' }
}, { timestamps: true });

module.exports = mongoose.model('Pincode', pincodeSchema);
