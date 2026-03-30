const express = require("express");
const router = express.Router();

// Middlewares
const protect = require("../middlewares/authMiddleware");

const routes = [
  { path: "/roles", route: require("./roleRoutes") },
  { path: "/users", route: require("./userRoute") },
  { path: "/merchants", route: require("./merchantRoute") },
  { path: "/transactions", route: require("./transactionRoute") },
  { path: "/paymentLinks", route: require("./paymentLinkRoute") },
  { path: "/refunds", route: require("./refundRoute") },
];

routes.forEach((route) => router.use(route.path, protect, route.route));

module.exports = router;
