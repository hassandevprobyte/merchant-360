// Validations
const joi = require("../validations/joi");
const joiSchema = require("../validations/joi/schema/paymentLink");
const paymentLinkValidation = require("../validations/paymentLink");
const merchantValidation = require("../validations/merchant");
const userValidation = require("../validations/user");

// Providers
const paymentLinkProvider = require("../providers/index");

exports.getPaymentLinksWithPagination = async () => {};

exports.getPaymentLinkById = async () => {};

exports.createPaymentLink = async (payload) => {
  const validatedPayload = joi.validate(payload, joiSchema.createPaymentLink);

  const [merchant, user] = await Promise.all([
    merchantValidation.throwErrorIfMerchantDoesNotExists(
      validatedPayload.merchant,
    ),
    userValidation.throwErrorIfUserDoesNotExist(validatedPayload.user),
  ]);

  const paymentLinkPayload = {
    merchant: merchant,
    amount: validatedPayload.amount,
    email: validatedPayload.email,
    name: validatedPayload.name,
    description: validatedPayload.description,
    user: validatedPayload.user,
  };

  return paymentLinkProvider.createPaymentLink(paymentLinkPayload);
};

exports.updatePaymentLink = async () => {};
