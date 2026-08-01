require('dotenv').config();
require('./config/validateEnv')();
const connectDB = require('./config/db');
const app = require('./app');

// Connect Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
