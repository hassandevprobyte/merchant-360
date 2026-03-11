const Boom = require("@hapi/boom");

// Repositories
const roleRepository = require("../repositories/roleRepository");
const userRepository = require("../repositories/userRepository");

// Constants
const message = require("../constants/MESSAGE");

exports.throwErrorIfRoleDoesNotExist = async (roleId) => {
  const role = await roleRepository.getRoleById(roleId);

  if (!role) {
    throw Boom.notFound(message.error.role.notFound);
  }

  return role;
};

exports.throwErrorIfRoleTitleExists = async (title) => {
  const titleExists = await roleRepository.getRoleByTitle(title);

  if (titleExists) {
    throw Boom.conflict(message.error.role.titleExists);
  }
};

exports.throwErrorIfRoleIsAssignedOnUser = async (roleId) => {
  const roleIsAssigned = await userRepository.getUserByRoleId(roleId);

  if (roleIsAssigned) {
    throw Boom.conflict(message.error.role.assignedOnUser);
  }
};
