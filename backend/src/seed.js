require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Order = require('./models/Order');
const Pincode = require('./models/Pincode');
const PricingTier = require('./models/PricingTier');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bhavya-express';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    // Clear existing data
    await User.deleteMany();
    await Order.deleteMany();
    await Pincode.deleteMany();
    await PricingTier.deleteMany();

    // 1. Seed Admin & Customer User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      name: 'Bhavya (Admin)',
      email: 'admin@bhavyaexpress.com',
      phone: '9999999999',
      password: hashedPassword,
      role: 'admin'
    });

    const customer = await User.create({
      name: 'Test Customer',
      email: 'customer@test.com',
      phone: '8888888888',
      password: hashedPassword,
      role: 'user'
    });

    // 2. Seed Pincodes (Lookup table for zones)
    const pincodes = [
      { pincode: '110001', city: 'New Delhi', state: 'Delhi', zone: 'local' },
      { pincode: '110020', city: 'New Delhi', state: 'Delhi', zone: 'local' },
      { pincode: '122001', city: 'Gurugram', state: 'Haryana', zone: 'regional' },
      { pincode: '201301', city: 'Noida', state: 'Uttar Pradesh', zone: 'regional' },
      { pincode: '400001', city: 'Mumbai', state: 'Maharashtra', zone: 'national' },
      { pincode: '560001', city: 'Bengaluru', state: 'Karnataka', zone: 'national' },
      { pincode: '600001', city: 'Chennai', state: 'Tamil Nadu', zone: 'national' },
    ];
    await Pincode.insertMany(pincodes);

    // 2.5 Seed Pricing Tiers
    const tiers = [
      {
        name: 'Local Delivery',
        description: 'Same city, lightning fast.',
        basePrice: 50,
        deliveryTime: 'Same day delivery',
        features: ['Same day delivery', 'Dedicated riders'],
        icon: 'MapPin',
        isPopular: false,
        order: 1
      },
      {
        name: 'Regional Transport',
        description: 'Intra-state, secure routing.',
        basePrice: 75,
        deliveryTime: '1-3 days delivery',
        features: ['1-3 days delivery', 'Priority handling'],
        icon: 'Truck',
        isPopular: true,
        order: 2
      },
      {
        name: 'National Logistics',
        description: 'Cross-country, wide reach.',
        basePrice: 125,
        deliveryTime: '3-7 days delivery',
        features: ['3-7 days delivery', 'Air & Surface modes'],
        icon: 'Globe',
        isPopular: false,
        order: 3
      }
    ];
    await PricingTier.insertMany(tiers);

    // 3. Seed Orders (Various statuses for timeline testing)
    const baseSender = { name: 'Rahul', phone: '9876543210', address: '123 Main St', pincode: '110001', city: 'New Delhi', state: 'Delhi' };
    const baseReceiver = { name: 'Priya', phone: '0123456789', address: '456 Cross Rd', pincode: '400001', city: 'Mumbai', state: 'Maharashtra' };
    
    // Statuses: 'Booked', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'
    
    const orders = [
      {
        trackingId: 'BHV1000001',
        user: customer._id,
        sender: baseSender,
        receiver: baseReceiver,
        weight: 2.5,
        zone: 'national',
        price: 150, // 50 + (2.5 * 20) = 100 * 2.5 = 250 (mock price)
        status: 'Booked',
        paymentStatus: 'completed',
        statusHistory: [
          { status: 'Booked', timestamp: new Date(Date.now() - 3600000) }
        ]
      },
      {
        trackingId: 'BHV1000002',
        user: customer._id,
        sender: baseSender,
        receiver: { ...baseReceiver, city: 'Gurugram', state: 'Haryana', pincode: '122001' },
        weight: 1,
        zone: 'regional',
        price: 105, 
        status: 'In Transit',
        paymentStatus: 'completed',
        statusHistory: [
          { status: 'Booked', timestamp: new Date(Date.now() - 86400000) },
          { status: 'Picked Up', timestamp: new Date(Date.now() - 43200000) },
          { status: 'In Transit', timestamp: new Date(Date.now() - 10000000) }
        ]
      },
      {
        trackingId: 'BHV1000003',
        user: customer._id,
        sender: baseSender,
        receiver: baseReceiver,
        weight: 5,
        zone: 'national',
        price: 375, 
        status: 'Delivered',
        paymentStatus: 'completed',
        statusHistory: [
          { status: 'Booked', timestamp: new Date(Date.now() - 4 * 86400000) },
          { status: 'Picked Up', timestamp: new Date(Date.now() - 3 * 86400000) },
          { status: 'In Transit', timestamp: new Date(Date.now() - 2 * 86400000) },
          { status: 'Out for Delivery', timestamp: new Date(Date.now() - 86400000) },
          { status: 'Delivered', timestamp: new Date() }
        ]
      }
    ];

    await Order.insertMany(orders);

    console.log('Data Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
