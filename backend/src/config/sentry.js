// Optional error tracking. Everything is inert unless SENTRY_DSN is set,
// so the app runs identically in local dev without any Sentry account.
const Sentry = require('@sentry/node');

let enabled = false;
if (process.env.SENTRY_DSN && process.env.NODE_ENV !== 'test') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.1
  });
  enabled = true;
}

const captureException = (err) => {
  if (enabled) Sentry.captureException(err);
};

const requestHandler = enabled
  ? Sentry.Handlers.requestHandler()
  : (req, res, next) => next();

module.exports = { captureException, requestHandler, isEnabled: () => enabled };
