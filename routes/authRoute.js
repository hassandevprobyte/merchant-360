const express = require("express");
const router = express.Router();
const rateLimiter = require("../middlewares/rateLimiter");

// Controllers
const authController = require("../controllers/authController");

// Middlewares
const protect = require("../middlewares/authMiddleware");

router.post("/login", rateLimiter, authController.login);
router.get("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.patch("/changePassword", protect, authController.changePassword);

module.exports = router;
