const express = require("express");
const router = express.Router();

// Controllers
const paymentLinkController = require("../controllers/paymentLinkController");

router.route("/").post(paymentLinkController.createPaymentLink);

module.exports = router;
