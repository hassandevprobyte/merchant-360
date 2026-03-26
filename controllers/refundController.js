const asyncHandler = require("express-async-handler");

// Service
const refundService = require("../services/refundService");

exports.createRefund = asyncHandler(async (req, res) => {
  const payload = {
    id: req.params.id,
    merchant: req.body.merchant,
    amount: req.body.amount,
  };
  const data = await refundService.createRefund(payload);

  res.status(201).json(data);
});
