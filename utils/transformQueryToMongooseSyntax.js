const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

function isValidObjectId(str) {
  const isValidHex = /^[0-9a-fA-F]{24}$/.test(str);

  return isValidHex && ObjectId.isValid(str);
}

function convertStringToType(str, isNested = false) {
  if (isValidObjectId(str)) {
    return new ObjectId(str);
  }

  if (str === "true" || str === "false") {
    return str === "true";
  }

  if (!isNaN(Number(str))) {
    return Number(str);
  }

  const date = new Date(str);
  if (!isNaN(date.getTime())) {
    return date;
  }

  if (isNested) {
    return str;
  }

  return { $regex: str, $options: "i" };
}

function transformValues(obj, keyStartsWithMongooseOperator = false) {
  if (Array.isArray(obj)) {
    return keyStartsWithMongooseOperator
      ? obj.map((item) => transformValues(item, true))
      : { $in: obj.map((item) => transformValues(item, true)) };
  }

  if (typeof obj === "string") {
    return convertStringToType(obj, keyStartsWithMongooseOperator);
  }

  if (isValidObjectId(obj)) {
    return obj;
  }

  if (typeof obj === "object") {
    const converted = Array.isArray(obj) ? [] : {};

    for (const [key, val] of Object.entries(obj)) {
      if (key === "startDate" || key === "endDate") {
        converted[`$${key === "startDate" ? "gte" : "lte"}`] = transformValues(
          val,
          key.startsWith("$"),
        );
      }

      converted[key] = transformValues(val, key.startsWith("$"));
    }

    delete converted.startDate;
    delete converted.endDate;

    return converted;
  }

  return obj;
}

function transformQueryToMongooseSyntax(
  modelName,
  queryParams = {},
  additionalFields = [],
  fieldsNotToTransform = [],
) {
  const modelSchemaFields = Object.keys(mongoose.model(modelName).schema.paths);
  const allowedFields = [
    ...modelSchemaFields,
    ...additionalFields,
    "startDate",
    "endDate",
  ].filter((field) => !fieldsNotToTransform.includes(field));

  const eliminateNullishValues = (value) => {
    return value !== null && value !== undefined && value !== "";
  };

  const allowedParams = Object.fromEntries(
    Object.entries(queryParams).filter(
      ([key, value]) =>
        allowedFields.includes(key) && eliminateNullishValues(value),
    ),
  );

  const nonTransformValues = fieldsNotToTransform.reduce(
    (acc, field) =>
      !!queryParams[field] ? { ...acc, [field]: queryParams[field] } : acc,
    {},
  );

  return { ...transformValues(allowedParams), ...nonTransformValues };
}

module.exports = transformQueryToMongooseSyntax;
