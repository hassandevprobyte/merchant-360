const Boom = require("@hapi/boom");

// Constants
const message = require("../constants/MESSAGE");

exports.checkPermissions = (modelName) => (req, res, next) => {
  const { roleAndPermissions } = req.user;

  const permission = roleAndPermissions.permissions.find(
    (p) => p.model.toLowerCase() === modelName.toLowerCase(),
  );

  if (permission && permission.actions.includes(req.method)) {
    next();
  } else {
    throw Boom.forbidden(message.error.auth.forbidden);
  }
};
