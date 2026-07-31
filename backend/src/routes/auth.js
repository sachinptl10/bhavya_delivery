const express = require('express');
const router = express.Router();
const passport = require('passport');
const { registerUser, loginUser, getMe, googleAuthCallback, logoutUser } = require('../controllers/authController');
const { protect, isAuthenticated } = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimiters');

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);

// Google OAuth for Users
router.get('/google/user', passport.authenticate('google-user', { scope: ['profile', 'email'] }));
router.get('/google/user/callback', 
  passport.authenticate('google-user', { session: false, failureRedirect: '/login?error=auth_failed' }),
  googleAuthCallback
);

// Google OAuth for Admins
router.get('/google/admin', passport.authenticate('google-admin', { scope: ['profile', 'email'] }));
router.get('/google/admin/callback', 
  passport.authenticate('google-admin', { session: false, failureRedirect: '/admin/login?error=auth_failed' }),
  googleAuthCallback
);

module.exports = router;
