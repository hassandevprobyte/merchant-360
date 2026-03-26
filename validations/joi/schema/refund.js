const Joi = require("joi");
const { objectId } = require("../index");

exports.createRefund = Joi.object({
  id: Joi.string().required(),
  amount: Joi.number().integer().required(),
  merchant: objectId.required(),
});
