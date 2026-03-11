const asyncHandler = require("express-async-handler");

// Services
const merchantService = require("../services/merchantService");

// Utilities
const transformQueryParams = require("../utils/transformQueryToMongooseSyntax");

exports.getAllMerchants = asyncHandler(async (req, res) => {
  const filters = transformQueryParams("Merchant", req.query.query);
  const data = await merchantService.getAllMerchants(filters);

  res.status(200).json(data);
});

exports.getMerchantsWithPagination = asyncHandler(async (req, res) => {
  const payload = {
    filters: transformQueryParams("Merchant", req.query.query),
    page: parseInt(req.query.page) || 1,
    pageSize: parseInt(req.query.pageSize) || 10,
  };

  const data = await merchantService.getMerchantsWithPagination(payload);

  res.status(200).json(data);
});

exports.getMerchantById = asyncHandler(async (req, res) => {
  const data = await merchantService.getMerchantById(req.params.id);

  res.status(200).json(data);
});

exports.createMerchant = asyncHandler(async (req, res) => {
  const payload = {
    title: req.body.title,
    type: req.body.type,
    isActive: req.body.isActive,
  };

  const data = await merchantService.createMerchant(payload);

  res.status(201).json(data);
});

exports.updateMerchant = asyncHandler(async (req, res) => {
  const payload = {
    id: req.params.id,
    title: req.body.title,
    type: req.body.type,
    isActive: req.body.isActive,
  };

  const data = await merchantService.updateMerchant(payload);

  res.status(201).json(data);
});
