const Joi = require("joi");
const { objectId } = require("../index");

exports.getPaymentLinkById = objectId.required();

exports.createPaymentLink = Joi.object({
  merchant: objectId.required(),
  user: objectId.required(),
  amount: Joi.number().integer().required(),
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  description: Joi.string().optional(),
});
