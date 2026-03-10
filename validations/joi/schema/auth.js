const Joi = require("joi");
const { objectId } = require("../index");

exports.login = Joi.object({
  email: Joi.string().email().lowercase().trim().min(2).max(255).required(),
  password: Joi.string().required(),
});

exports.changePassword = Joi.object({
  id: objectId.required(),
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});
