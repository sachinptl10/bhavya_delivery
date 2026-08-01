const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const { globalLimiter } = require('./middlewares/rateLimiters');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const { requestHandler: sentryRequestHandler } = require('./config/sentry');
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./config/openapi');

const PROD_LIKE_ENVS = ['production', 'staging'];

const app = express();

// Render/most PaaS run behind one proxy hop; needed for correct client IPs
// in rate limiting and secure cookies.
if (PROD_LIKE_ENVS.includes(process.env.NODE_ENV)) {
  app.set('trust proxy', 1);
}

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  process.env.VITE_FRONTEND_URL
].filter(Boolean);

app.use(helmet());
app.use(compression());
app.use(sentryRequestHandler);
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(globalLimiter);
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/pincodes', require('./routes/pincodes'));
app.use('/api/pricing-tiers', require('./routes/pricing-tiers'));

app.get('/', (req, res) => {
  res.send('Bhavya Express API is running...');
});

// Health check for uptime monitors and Render's healthCheckPath.
app.get('/api/health', (req, res) => {
  const dbState = require('mongoose').connection.readyState; // 1 = connected
  const healthy = dbState === 1;
  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    db: healthy ? 'connected' : 'disconnected',
    uptime: Math.floor(process.uptime())
  });
});

// API documentation (Swagger UI). Helmet's CSP would block the UI's
// inline scripts, so it is relaxed for this path only.
app.use('/api/docs', helmet({ contentSecurityPolicy: false }));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, { customSiteTitle: 'Bhavya Express API Docs' }));
app.get('/api/docs.json', (req, res) => res.json(openapiSpec));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
