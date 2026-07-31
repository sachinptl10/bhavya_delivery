// Global error handler: logs the full error server-side and returns a
// standardized JSON envelope without leaking internals to clients.
const errorHandler = (err, req, res, next) => {
  console.error(`${req.method} ${req.originalUrl}:`, err);

  const status = err.statusCode || err.status || 500;
  const message = status < 500 && err.message ? err.message : 'Internal server error';

  res.status(status).json({ message });
};

const notFound = (req, res) => {
  res.status(404).json({ message: 'Route not found' });
};

module.exports = { errorHandler, notFound };
