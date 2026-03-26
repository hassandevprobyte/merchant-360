const Boom = require("@hapi/boom");

// Repositories
const paymentLinkRepository = require("../repositories/paymentLinkRepository");

// Constants
const message = require("../constants/MESSAGE");

exports.throwErrorIfPaymentLinkAlreadyExists = async (filters) => {
  const data = await paymentLinkRepository.getPaymentLink(filters);
  if (data) {
    throw Boom.conflict(message.error.paymentLink.alreadyExists);
  }

  return true;
};

exports.throwErrorIfPaymentLinkDoesNotExists = async (filters) => {
  const data = await paymentLinkRepository.getPaymentLink(filters);
  if (!data) {
    throw Boom.notFound(message.error.paymentLink.notFound);
  }

  return data;
};
