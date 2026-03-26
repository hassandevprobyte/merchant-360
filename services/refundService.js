// Validations
const joi = require("../validations/joi");
const joiSchema = require("../validations/joi/schema/refund");
const merchantValidation = require("../validations/merchant");

// Providers
const refundProvider = require("../providers/index");

exports.createRefund = async (payload) => {
  const validatedPayload = joi.validate(payload, joiSchema.createRefund);

  const merchant = await merchantValidation.throwErrorIfMerchantDoesNotExists(
    validatedPayload.merchant,
  );

  const refundPayload = {
    merchant,
    transactionId: validatedPayload.id,
    amount: validatedPayload.amount,
  };

  return refundProvider.refundTransaction(refundPayload);
};
