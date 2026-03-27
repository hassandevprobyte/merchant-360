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

exports.getRefundsByMerchantId = asyncHandler(async (req, res) => {
  const payload = {
    id: req.params.id,
    filters: req.query.query || {},
    page: req.query.page || 1,
    pageSize: req.query.pageSize || 10,
  };
  const data = await refundService.getRefundsByMerchantId(payload);

  res.status(200).json(data);
});

exports.getRefundsByTransactionId = asyncHandler(async (req, res) => {
  const payload = {
    id: req.params.id,
    merchant: req.query.merchant,
  };
  const data = await refundService.getRefundsByTransactionId(payload);

  res.status(200).json(data);
});
