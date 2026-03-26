const express = require("express");
const router = express.Router();

// Controllers
const refundController = require("../controllers/refundController");

router.route("/:id").post(refundController.createRefund);

module.exports = router;
