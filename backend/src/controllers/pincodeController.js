const Pincode = require('../models/Pincode');

exports.checkServiceability = async (req, res, next) => {
  const { pincode } = req.params;
  try {
    const data = await Pincode.findOne({ pincode });
    if (data) {
      res.json({ serviceable: true, zone: data.zone, city: data.city, state: data.state });
    } else {
      res.json({ serviceable: false });
    }
  } catch (error) {
    next(error);
  }
};

exports.getAllPincodes = async (req, res, next) => {
  try {
    const pincodes = await Pincode.find({});
    res.json(pincodes);
  } catch (error) {
    next(error);
  }
};
