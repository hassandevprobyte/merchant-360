const Boom = require("@hapi/boom");

// Validations
const userValidation = require("../validations/user");

// Constants
const SCOPE = require("../constants/SCOPE");
const message = require("../constants/MESSAGE");

const normalizeToArray = (value) => {
  if (!value) return [];

  return Array.isArray(value) ? value.map(String) : [String(value)];
};

exports.scope = (authUser, queryRoles) => {
  const userScope = authUser.roleAndPermissions.scope;
  const requestedRoles = normalizeToArray(queryRoles);
  const hasMatchingRole = requestedRoles.includes(
    authUser.roleAndPermissions._id,
  );

  switch (userScope) {
    case SCOPE.OWN:
      if (hasMatchingRole) {
        return { _id: authUser._id };
      }

      return { brands: { $in: authUser.brands } };

    case SCOPE.COMPANY:
      return { brands: { $in: authUser.brands } };

    case SCOPE.ALL:
      return {};

    default:
      return { _id: authUser._id };
  }
};

exports.authorizeByScope = async (authUser, userId) => {
  const user = await userValidation.throwErrorIfUserDoesNotExist(userId);

  const userScope = authUser.roleAndPermissions.scope;

  let authorized = false;

  switch (userScope) {
    case SCOPE.OWN:
      authorized = authUser.id.toString() === user._id.toString();
      break;

    case SCOPE.COMPANY:
      authorized = authUser.brands.some((b) => user.brands.includes(b));
      break;

    case SCOPE.ALL:
      authorized = true;
      break;

    default:
      authorized = false;
      break;
  }

  if (!authorized) {
    throw Boom.forbidden(message.error.auth.forbidden);
  }
};
