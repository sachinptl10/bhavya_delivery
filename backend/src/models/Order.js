const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: {
    name: String,
    phone: String,
    address: String,
    pincode: String,
    city: String,
    state: String
  },
  receiver: {
    name: String,
    phone: String,
    address: String,
    pincode: String,
    city: String,
    state: String
  },
  weight: { type: Number, required: true },
  zone: { type: String, enum: ['local', 'regional', 'national'], required: true },
  price: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Booked', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'], 
    default: 'Booked' 
  },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  statusHistory: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    location: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
