const Boom = require("@hapi/boom");

// Repositories
const merchantRepository = require("../repositories/merchantRepository");

// Constants
const message = require("../constants/MESSAGE");

exports.throwErrorIfMerchantTitleAlreadyExists = async (title) => {
  const merchant = await merchantRepository.findMerchant({ title });
  if (merchant) {
    throw Boom.conflict(message.error.merchant.titleExists);
  }

  return true;
};

exports.throwErrorIfMerchantDoesNotExists = async (id) => {
  const merchant = await merchantRepository.findMerchantById(id);
  if (!merchant) {
    throw Boom.notFound(message.error.merchant.notFound);
  }

  return merchant;
};
