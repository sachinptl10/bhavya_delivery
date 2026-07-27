const Order = require('../models/Order');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = status;
      order.statusHistory.push({ status });
      await order.save();
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const orders = await Order.find({});
    
    const totalOrders = orders.length;
    const revenue = orders.filter(o => o.paymentStatus === 'completed').reduce((acc, o) => acc + o.price, 0);
    const activeDeliveries = orders.filter(o => ['Booked', 'Picked Up', 'In Transit', 'Out for Delivery'].includes(o.status)).length;
    
    res.json({
      totalOrders,
      revenue,
      activeDeliveries
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
