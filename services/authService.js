const Boom = require("@hapi/boom");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Repositories
const userRepository = require("../repositories/userRepository");

// Validations
const joi = require("../validations/joi");
const joiSchema = require("../validations/joi/schema/auth");
const authValidation = require("../validations/auth");

// Constants
const message = require("../constants/MESSAGE");

// Environment variables
const { env } = require("../config");

exports.login = async (payload) => {
  const validatedPayload = joi.validate(payload, joiSchema.login);

  const user = await authValidation.throwErrorIfUserEmailDoesNotExist(
    validatedPayload.email,
  );
  await user.populate("roleAndPermissions");

  if (!user.isActive) {
    throw Boom.forbidden(message.error.auth.accessDenied);
  }

  const matchPassword = await bcrypt.compare(
    validatedPayload.password,
    user.password,
  );

  if (!matchPassword) {
    throw Boom.badRequest(message.error.auth.invalidCredentials);
  }

  const token = jwt.sign({ id: user._id }, env.JWT.SECRET, {
    expiresIn: "30d",
  });

  const userPayload = {
    id: user._id,
    name: user.name,
    email: user.email,
    roleAndPermissions: user.roleAndPermissions,
    token,
  };

  return userPayload;
};

exports.refresh = async (cookies) => {
  if (!cookies?.jwt) {
    throw Boom.unauthorized(message.error.auth.unauthorized);
  }

  const refreshToken = cookies.jwt;

  try {
    const decoded = jwt.verify(refreshToken, env.JWT.REFRESH_TOKEN);

    const user = await authValidation.throwErrorIfUserEmailDoesNotExist(
      decoded.email,
    );
    await user.populate("roleAndPermissions");

    const userPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      roleAndPermissions: user.roleAndPermissions,
    };

    const accessToken = jwt.sign(userPayload, env.JWT.ACCESS_TOKEN, {
      expiresIn: "1d",
    });

    return { accessToken };
  } catch (error) {
    throw Boom.unauthorized(message.error.auth.unauthorized);
  }
};

exports.changePassword = async (payload) => {
  const validatedPayload = joi.validate(payload, joiSchema.changePassword);

  const userPassword = await userRepository.getUserPasswordById(
    validatedPayload.id,
  );

  const matchPassword = await bcrypt.compare(
    validatedPayload.oldPassword,
    userPassword,
  );

  if (!matchPassword) {
    throw Boom.badRequest(message.error.auth.incorrectOldPassword);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(validatedPayload.newPassword, salt);

  const updatePayload = { password: hashedPassword };

  return userRepository.updateUserById(validatedPayload.id, updatePayload);
};
