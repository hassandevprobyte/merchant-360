const Joi = require("joi");
const { objectId } = require("../index");

// Constants
const MERCHANT_TYPES = require("../../../constants/MERCHANT_TYPES");

const getCredentialSchema = (type) => {
  const merchant = Object.values(MERCHANT_TYPES).find((m) => m.type === type);

  if (!merchant) return Joi.object({});

  const schema = {};
  Object.keys(merchant.credentials).forEach((key) => {
    schema[key] = Joi.string().required();
  });

  return Joi.object(schema);
};

exports.getMerchantById = objectId.required();

exports.createMerchant = Joi.object({
  title: Joi.string().lowercase().required(),
  type: Joi.string()
    .valid(...Object.values(MERCHANT_TYPES).map((m) => m.type))
    .required(),
  isActive: Joi.boolean().required(),
  credentials: Joi.any().custom((value, helpers) => {
    const { type } = helpers.state.ancestors[0];
    const schema = getCredentialSchema(type);

    const { error } = schema.validate(value);
    if (error) return helpers.message(error.message);

    return value;
  }),
});

exports.updateMerchant = Joi.object({
  id: objectId.required(),
  title: Joi.string().lowercase().optional(),
  type: Joi.string()
    .valid(...Object.values(MERCHANT_TYPES).map((m) => m.type))
    .optional(),
  isActive: Joi.boolean().optional(),
});
