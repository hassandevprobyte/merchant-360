const asyncHandler = require("express-async-handler");

// Services
const paymentLinkService = require("../services/paymentLinkService");

exports.getPaymentLinksWithPagination = asyncHandler(async (req, res) => {});

exports.getPaymentLinkById = asyncHandler(async (req, res) => {});

exports.createPaymentLink = asyncHandler(async (req, res) => {
  const payload = {
    user: req.user._id,
    merchant: req.body.merchant,
    amount: req.body.amount,
    email: req.body.email,
    name: req.body.name,
    description: req.body.description,
  };

  const data = await paymentLinkService.createPaymentLink(payload);

  res.status(201).json(data);
});

exports.updatePaymentLink = asyncHandler(async (req, res) => {});
