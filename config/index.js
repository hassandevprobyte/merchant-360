const env = require("./env");
const connectDB = require("./db");
const { allowedOrigins, corsOptions } = require("./cors");

module.exports = {
  env,
  connectDB,
  allowedOrigins,
  corsOptions,
};
