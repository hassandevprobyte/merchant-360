const { rateLimit } = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  legacyHeaders: false,
  standardHeaders: true,
});

module.exports = rateLimiter;
