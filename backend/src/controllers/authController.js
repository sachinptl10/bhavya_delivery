const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: ['production', 'staging'].includes(process.env.NODE_ENV),
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });
};

exports.registerUser = async (req, res, next) => {
  const { name, email, phone, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, phone, password: hashedPassword });
    if (user) {
      const token = generateToken(user._id);
      setTokenCookie(res, token);
      res.status(201).json({
        _id: user.id, name: user.name, email: user.email, role: user.role
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);
      setTokenCookie(res, token);
      res.json({
        _id: user.id, name: user.name, email: user.email, role: user.role
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

exports.googleAuthCallback = (req, res) => {
  if (!req.user) {
    return res.redirect(`${process.env.VITE_FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed`);
  }
  
  const token = generateToken(req.user._id);
  setTokenCookie(res, token);
  
  const frontendUrl = process.env.VITE_FRONTEND_URL || 'http://localhost:5173';
  const redirectUrl = req.user.role === 'admin' ? '/admin' : '/dashboard';
  
  res.redirect(`${frontendUrl}${redirectUrl}`);
};

exports.logoutUser = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    next(error);
  }
};
