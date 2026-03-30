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

exports.getRefundsByMerchantId = async (payload) => {
  const validatedPayload = joi.validate(
    payload,
    joiSchema.getRefundsByMerchantId,
  );

  const merchant = await merchantValidation.throwErrorIfMerchantDoesNotExists(
    validatedPayload.id,
  );

  const refundPayload = {
    merchant,
    page: validatedPayload.page,
    pageSize: validatedPayload.pageSize,
    filters: validatedPayload.filters,
  };

  return refundProvider.getRefundsByMerchantId(refundPayload);
};

exports.getRefundsByTransactionId = async (payload) => {
  const validatedPayload = joi.validate(
    payload,
    joiSchema.getRefundsByTransactionId,
  );

  const merchant = await merchantValidation.throwErrorIfMerchantDoesNotExists(
    validatedPayload.merchant,
  );

  const refundPayload = {
    merchant,
    transactionId: validatedPayload.id,
  };

  return refundProvider.getRefundsByTransactionId(refundPayload);
};
