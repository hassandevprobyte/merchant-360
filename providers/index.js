const Boom = require("@hapi/boom");
const { v4: uuidv4 } = require("uuid");

// paymentLinkService.js
const stripeProvider = require("./stripeProvider");
const authorizeProvider = require("./authorizeProvider");
const braintreeProvider = require("./braintreeProvider");

// repositories
const paymentLinkRepository = require("../repositories/paymentLinkRepository");

// Utils
const encryptData = require("../utils/encryptData");

exports.createPaymentLink = async ({
  merchant,
  amount,
  description,
  user,
  email,
  name,
}) => {
  let providerResponse = {};
  const linkId = uuidv4();

  switch (merchant.type) {
    case "stripe":
      providerResponse = await stripeProvider.createPaymentLink(
        amount,
        encryptData.decryptObjectValues(merchant.credentials),
        description,
      );
      break;

    case "authorize":
      providerResponse = await authorizeProvider.createPaymentLink(
        amount,
        encryptData.decryptObjectValues(merchant.credentials),
      );
      break;

    case "braintree":
      providerResponse = await braintreeProvider.createPaymentLink(
        amount,
        encryptData.decryptObjectValues(merchant.credentials),
      );
      break;

    default:
      throw Boom.badRequest("Merchant not supported");
  }

  const paymentLink = `https://336cjkcv-5174.inc1.devtunnels.ms/pay/${linkId}`;

  // Save link in DB
  const payload = {
    merchant: merchant._id,
    createdBy: user,
    linkId,
    paymentLink,
    amount,
    email,
    name,
    description,
    metadata: providerResponse,
  };

  return paymentLinkRepository.createPaymentLink(payload);
};

exports.refundTransaction = async ({ merchant, transactionId, amount }) => {
  switch (merchant.type) {
    case "stripe":
      return stripeProvider.refundPayment(
        amount,
        transactionId,
        encryptData.decryptObjectValues(merchant.credentials),
      );

    case "braintree":
      return braintreeProvider.refundPayment(
        amount,
        transactionId,
        encryptData.decryptObjectValues(merchant.credentials),
      );

    case "authorize":
      return authorizeProvider.refundPayment(
        amount,
        transactionId,
        encryptData.decryptObjectValues(merchant.credentials),
      );

    default:
      throw Boom.badRequest("Merchant not supported");
  }
};
