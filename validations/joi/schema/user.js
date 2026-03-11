const Joi = require("joi");
const { objectId } = require("../index");

exports.getUserById = objectId.required();

exports.createUser = Joi.object({
  name: Joi.string().lowercase().trim().min(2).max(255).required(),
  email: Joi.string().email().lowercase().trim().min(2).max(255).required(),
  password: Joi.string().required(),
  roleAndPermissions: objectId.required(),
  isActive: Joi.boolean().default(true),
});

exports.updateUser = Joi.object({
  id: objectId.required(),
  name: Joi.string().lowercase().trim().min(2).max(255).optional(),
  email: Joi.string().email().lowercase().trim().min(2).max(255).optional(),
  password: Joi.string().empty("").optional(),
  roleAndPermissions: objectId.optional(),
  isActive: Joi.boolean().optional(),
});
