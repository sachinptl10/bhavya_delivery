const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const serverUrl = process.env.VITE_API_URL || 'http://localhost:5000/api';

// Strategy for regular Users
passport.use('google-user', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret',
    callbackURL: `${serverUrl}/auth/google/user/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find existing user by googleId OR email
      let user = await User.findOne({ 
        $or: [
          { googleId: profile.id },
          { email: profile.emails[0].value }
        ]
      });

      if (user) {
        // If user exists but doesn't have googleId yet, update it
        if (!user.googleId) {
          user.googleId = profile.id;
        }
        user.avatarUrl = profile.photos[0]?.value || user.avatarUrl;
        user.lastLogin = new Date();
        // Ensure role is preserved, defaulting to user
        user.role = user.role || 'user';
        await user.save();
        return done(null, user);
      }

      // Create new user if they don't exist
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        avatarUrl: profile.photos[0]?.value,
        role: 'user',
        lastLogin: new Date()
      });

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Strategy for Admins
passport.use('google-admin', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret',
    callbackURL: `${serverUrl}/auth/google/admin/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const allowedAdmins = (process.env.ADMIN_WHITELIST_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
      
      // Strict Whitelist Check
      if (!allowedAdmins.includes(email.toLowerCase())) {
        console.warn(`[AUTH_WARNING] Unauthorized admin login attempt by: ${email}`);
        return done(null, false, { message: 'Unauthorized admin access.' });
      }

      let user = await User.findOne({ email });

      if (user) {
        // Must already be marked as admin in DB, or we enforce it here since they are on the whitelist
        user.googleId = profile.id;
        user.avatarUrl = profile.photos[0]?.value || user.avatarUrl;
        user.lastLogin = new Date();
        user.role = 'admin'; // Enforce admin role based on whitelist
        await user.save();
        return done(null, user);
      }

      // Pre-seed the admin if they are on the whitelist but don't exist yet
      user = await User.create({
        name: profile.displayName,
        email: email,
        googleId: profile.id,
        avatarUrl: profile.photos[0]?.value,
        role: 'admin',
        lastLogin: new Date()
      });

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

module.exports = passport;
