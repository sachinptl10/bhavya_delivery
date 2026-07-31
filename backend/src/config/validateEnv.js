// Validates required environment variables at boot. The server refuses to
// start with missing or placeholder secrets instead of falling back to
// insecure defaults.
const PLACEHOLDER_PATTERNS = [/your_.*_here/i, /changeme/i, /^secret123$/];

const REQUIRED = ['MONGO_URI', 'JWT_SECRET'];

// Required in production only — the app degrades gracefully without them in dev.
const REQUIRED_IN_PRODUCTION = ['VITE_FRONTEND_URL'];

const isPlaceholder = (value) =>
  PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(value));

const validateEnv = () => {
  const required = [...REQUIRED];
  if (process.env.NODE_ENV === 'production') {
    required.push(...REQUIRED_IN_PRODUCTION);
  }

  const problems = [];
  for (const name of required) {
    const value = process.env[name];
    if (!value) {
      problems.push(`${name} is not set`);
    } else if (isPlaceholder(value)) {
      problems.push(`${name} is still a placeholder value`);
    }
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    problems.push('JWT_SECRET must be at least 32 characters');
  }

  if (problems.length > 0) {
    console.error('Invalid environment configuration:');
    problems.forEach((p) => console.error(`  - ${p}`));
    console.error('Set these in backend/.env (see backend/.env.example).');
    process.exit(1);
  }
};

module.exports = validateEnv;
