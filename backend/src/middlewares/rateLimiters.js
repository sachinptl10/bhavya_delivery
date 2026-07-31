const rateLimit = require('express-rate-limit');

// Strict: login/register — brute-force and credential-stuffing protection
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later' }
});

// Moderate: public tracking — anti-enumeration of 8-digit tracking IDs
const trackingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many tracking requests, please try again later' }
});

// Loose: global backstop for the whole API
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' }
});

module.exports = { authLimiter, trackingLimiter, globalLimiter };
