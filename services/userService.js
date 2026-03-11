const bcrypt = require("bcrypt");

// Repository
const userRepository = require("../repositories/userRepository");

// Validations
const joi = require("../validations/joi");
const joiSchema = require("../validations/joi/schema/user");
const userValidation = require("../validations/user");
const roleValidation = require("../validations/role");

exports.getAllUsers = async (filters) => {
  return userRepository.getAllUsers(filters);
};

exports.getUsersWithPagination = async (payload) => {
  const { filters, page, pageSize } = payload;
  const offset = (page - 1) * pageSize;

  const users = await userRepository.getUsersWithPagination(
    filters,
    offset,
    pageSize,
  );
  const usersCount = await userRepository.getUsersCount(filters);
  const meta = {
    totalCount: usersCount,
    totalPages: Math.ceil(usersCount / pageSize),
    page,
    pageSize,
  };

  return { data: users, meta };
};

exports.getUserById = async (userId) => {
  joi.validate(userId, joiSchema.getUserById);

  return userValidation.throwErrorIfUserDoesNotExist(userId);
};

exports.createUser = async (payload) => {
  const validatedPayload = joi.validate(payload, joiSchema.createUser);

  await userValidation.throwErrorIfUserEmailExists(validatedPayload.email);

  await roleValidation.throwErrorIfRoleDoesNotExist(
    validatedPayload.roleAndPermissions,
  );

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(validatedPayload.password, salt);

  const createPayload = { ...validatedPayload, password: hashedPassword };

  return userRepository.createUser(createPayload);
};

exports.updateUser = async (payload) => {
  const validatedPayload = joi.validate(payload, joiSchema.updateUser);

  const existingUser = await userValidation.throwErrorIfUserDoesNotExist(
    validatedPayload.id,
  );

  const updatePayload = {};

  if (validatedPayload.name && existingUser.name !== validatedPayload.name) {
    updatePayload.name = validatedPayload.name;
  }

  if (validatedPayload.email && existingUser.email !== validatedPayload.email) {
    await userValidation.throwErrorIfUserEmailExists(validatedPayload.email);

    updatePayload.email = validatedPayload.email;
  }

  if (validatedPayload.password) {
    const oldPassword = await userRepository.getUserPasswordById(
      existingUser._id,
    );

    const compare = await bcrypt.compare(
      validatedPayload.password,
      oldPassword,
    );

    if (!compare) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(validatedPayload.password, salt);

      updatePayload.password = hashedPassword;
    }
  }

  if (
    validatedPayload.roleAndPermissions &&
    validatedPayload.roleAndPermissions.toString() !==
      existingUser.roleAndPermissions._id.toString()
  ) {
    await roleValidation.throwErrorIfRoleDoesNotExist(
      validatedPayload.roleAndPermissions,
    );

    updatePayload.roleAndPermissions = validatedPayload.roleAndPermissions;
  }

  if (
    validatedPayload.hasOwnProperty("isActive") &&
    validatedPayload.isActive !== existingUser.isActive
  ) {
    updatePayload.isActive = validatedPayload.isActive;
  }

  return userRepository.updateUserById(validatedPayload.id, updatePayload);
};

exports.deleteUser = async (userId) => {
  joi.validate(userId, joiSchema.getUserById);

  await userValidation.throwErrorIfUserDoesNotExist(userId);

  await userRepository.deleteUserById(userId);

  return { deletedId: userId };
};
