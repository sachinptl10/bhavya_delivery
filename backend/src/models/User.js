const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String },
  googleId: { type: String, sparse: true },
  avatarUrl: { type: String },
  lastLogin: { type: Date },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
