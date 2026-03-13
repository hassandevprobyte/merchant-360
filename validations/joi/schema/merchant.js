const Joi = require("joi");
const { objectId } = require("../index");

// Constants
const MERCHANT_TYPES = require("../../../constants/MERCHANT_TYPES");

exports.getMerchantById = objectId.required();

exports.createMerchant = Joi.object({
  title: Joi.string().lowercase().required(),
  type: Joi.string()
    .valid(...Object.values(MERCHANT_TYPES))
    .required(),
  isActive: Joi.boolean().required(),
});

exports.updateMerchant = Joi.object({
  id: objectId.required(),
  title: Joi.string().lowercase().optional(),
  type: Joi.string()
    .valid(...Object.values(MERCHANT_TYPES))
    .optional(),
  isActive: Joi.boolean().optional(),
});
