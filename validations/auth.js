const Boom = require("@hapi/boom");

// Repositories
const userRepository = require("../repositories/userRepository");

// Constants
const message = require("../constants/MESSAGE");

exports.throwErrorIfUserEmailDoesNotExist = async (userEmail) => {
  const user = await userRepository.getUserByEmail(userEmail);

  if (!user) {
    throw Boom.notFound(message.error.auth.emailNotExists);
  }

  return user;
};
