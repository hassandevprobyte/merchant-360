const Joi = require("joi");
const { objectId } = require("../index");

// Constants
const SCOPE = require("../../../constants/SCOPE");

exports.getRoleById = objectId.required();

exports.createRole = Joi.object({
  title: Joi.string().lowercase().trim().min(2).max(255).required(),
  permissions: Joi.array()
    .required()
    .min(1)
    .items(
      Joi.object({
        model: Joi.string().trim().required(),
        actions: Joi.array()
          .items(
            Joi.string()
              .uppercase()
              .valid("GET", "POST", "PATCH", "PUT", "DELETE"),
          )
          .unique()
          .min(1)
          .required(),
        modelUpdateFields: Joi.array()
          .unique()
          .items(Joi.string())
          .when("actions", {
            is: Joi.array().items(Joi.string().valid("PATCH", "PUT")),
            then: Joi.required(),
          }),
      }),
    ),
  scope: Joi.string()
    .lowercase()
    .trim()
    .valid(...Object.values(SCOPE))
    .required(),
  indexPath: Joi.string().lowercase().trim().min(1).max(255).required(),
});

exports.updateRole = Joi.object({
  id: objectId.required(),
  title: Joi.string().lowercase().trim().min(2).max(255).optional(),
  permissions: Joi.array()
    .optional()
    .min(1)
    .items(
      Joi.object({
        model: Joi.string().trim().optional(),
        actions: Joi.array()
          .items(
            Joi.string()
              .uppercase()
              .valid("GET", "POST", "PATCH", "PUT", "DELETE"),
          )
          .unique()
          .min(1)
          .optional(),
        modelUpdateFields: Joi.array()
          .unique()
          .items(Joi.string())
          .when("actions", {
            is: Joi.array().items(Joi.string().valid("GET", "POST", "DELETE")),
            then: Joi.optional(),
            otherwise: Joi.array().min(1).required(),
          }),
      }),
    ),
  scope: Joi.string()
    .lowercase()
    .trim()
    .valid(...Object.values(SCOPE))
    .optional(),
  indexPath: Joi.string().lowercase().trim().min(1).max(255).optional(),
});
