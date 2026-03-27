const Joi = require("joi");
const { objectId } = require("../index");

exports.createRefund = Joi.object({
  id: Joi.string().required(),
  amount: Joi.number().integer().required(),
  merchant: objectId.required(),
});

exports.getRefundsByMerchantId = Joi.object({
  id: objectId.required(),
  page: Joi.number().integer().required().default(1),
  pageSize: Joi.number().integer().required().default(10),
  filters: Joi.optional(),
});

exports.getRefundsByTransactionId = Joi.object({
  id: Joi.string().required(),
  merchant: objectId.required(),
});
