const Joi = require("joi");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const isValidObjectId = (value, helpers) => {
  if (/^[0-9a-fA-F]{24}$/.test(value) && ObjectId.isValid(value)) {
    return value;
  } else {
    return helpers.error("objectId.invalid");
  }
};

exports.objectId = Joi.custom(
  isValidObjectId,
  "validates MongoDB ObjectId",
).messages({ "objectId.invalid": "{#label} must be a valid MongoDB ObjectId" });

exports.objectIdsArray = Joi.string().custom(
  isValidObjectId,
  "ObjectId Validation",
);

exports.validate = (payload, schema, options) => {
  const { value, error } = schema.validate(payload, options);

  if (error) {
    error.isJoi = true;
    throw error;
  }

  return value;
};
