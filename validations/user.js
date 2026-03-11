const Boom = require("@hapi/boom");

// Repositories
const userRepository = require("../repositories/userRepository");

// Constants
const message = require("../constants/MESSAGE");

exports.throwErrorIfUserDoesNotExist = async (userId) => {
  const user = await userRepository.getUserById(userId);

  if (!user) {
    throw Boom.notFound(message.error.user.notFound);
  }

  return user;
};

exports.throwErrorIfAnyUserDoesNotExist = async (userIds) => {
  const users = await userRepository.getUsersByIds(userIds);

  if (users.length !== userIds.length) {
    throw Boom.conflict(message.error.user.notFound);
  }
};

exports.throwErrorIfUserEmailExists = async (email) => {
  const emailExists = await userRepository.getUserByEmail(email);

  if (emailExists) {
    throw Boom.conflict(message.error.user.emailExists);
  }
};

exports.throwErrorIfUserDoesNotExistInBrand = async (userId, brandId) => {
  const user = await userRepository.getUserByIdAndBrandId(userId, brandId);

  if (!user) {
    throw Boom.notFound(message.error.user.notFoundInBrand);
  }

  return user;
};

exports.throwErrorIfBrandsAndBrandAliasesAreNotSame = (
  brandIds,
  brandAliasesIds,
) => {
  if (brandIds.length !== brandAliasesIds.length) {
    throw Boom.conflict(message.error.user.brandsAndBrandAliasesNotMatch);
  }

  if (!brandIds.every((id) => brandAliasesIds.includes(id))) {
    throw Boom.conflict(message.error.user.brandsAndBrandAliasesNotMatch);
  }
};
