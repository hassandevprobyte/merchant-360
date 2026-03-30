const express = require("express");
const router = express.Router();

// Controllers
const refundController = require("../controllers/refundController");

router
  .route("/:id")
  .get(refundController.getRefundsByMerchantId)
  .post(refundController.createRefund);

router
  .route("/transactions/:id")
  .get(refundController.getRefundsByTransactionId);

module.exports = router;
