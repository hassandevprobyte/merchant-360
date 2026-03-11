const mongoose = require("mongoose");

// Repositories
const roleRepository = require("../repositories/roleRepository");

// Validations
const joi = require("../validations/joi");
const joiSchema = require("../validations/joi/schema/role");
const roleValidation = require("../validations/role");

exports.getAllRoles = async () => {
  return roleRepository.getAllRoles();
};

exports.getRolesWithPagination = async (payload) => {
  const { filters, page, pageSize } = payload;
  const offset = (page - 1) * pageSize;

  const roles = await roleRepository.getRolesWithPagination(
    filters,
    offset,
    pageSize,
  );
  const rolesCount = await roleRepository.getRolesCount(filters);
  const meta = {
    totalCount: rolesCount,
    totalPages: Math.ceil(rolesCount / pageSize),
    page,
    pageSize,
  };

  return { data: roles, meta };
};

exports.getAllModels = () => {
  const modelNames = mongoose.modelNames();

  const excludeModelUpdateFields = ["_id", "__v", "updatedAt"];

  const modelUpdateFields = (modelName) =>
    Object.keys(mongoose.model(modelName).schema.paths).filter(
      (field) => !excludeModelUpdateFields.includes(field),
    );

  const actions = [
    { title: "Create", method: "POST" },
    { title: "View", method: "GET" },
    { title: "Update", method: "PATCH" },
    { title: "Delete", method: "DELETE" },
  ];

  return modelNames.sort().map((modelName) => ({
    model: modelName,
    modelUpdateFields: modelUpdateFields(modelName),
    actions,
  }));
};

exports.getRoleById = async (roleId) => {
  joi.validate(roleId, joiSchema.getRoleById);

  return roleValidation.throwErrorIfRoleDoesNotExist(roleId);
};

exports.createRole = async (payload) => {
  const validatedPayload = joi.validate(payload, joiSchema.createRole);

  await roleValidation.throwErrorIfRoleTitleExists(validatedPayload.title);

  return roleRepository.createRole(validatedPayload);
};

exports.updateRole = async (payload) => {
  const validatedPayload = joi.validate(payload, joiSchema.updateRole);

  const existingRole = await roleValidation.throwErrorIfRoleDoesNotExist(
    validatedPayload.id,
  );

  if (validatedPayload.title && existingRole.title !== validatedPayload.title) {
    await roleValidation.throwErrorIfRoleTitleExists(validatedPayload.title);
  }

  return roleRepository.updateRoleById(validatedPayload.id, validatedPayload);
};

exports.deleteRole = async (roleId) => {
  joi.validate(roleId, joiSchema.getRoleById);

  await roleValidation.throwErrorIfRoleDoesNotExist(roleId);
  await roleValidation.throwErrorIfRoleIsAssignedOnUser(roleId);

  await roleRepository.deleteRoleById(roleId);

  return { deletedId: roleId };
};
