const express = require("express");
const router = express.Router();

// Controllers
const merchantController = require("../controllers/merchantController");

// Routes
router
  .route("/")
  .get(merchantController.getMerchantsWithPagination)
  .post(merchantController.createMerchant);

router
  .route("/:id")
  .get(merchantController.getMerchantById)
  .patch(merchantController.updateMerchant);

module.exports = router;
