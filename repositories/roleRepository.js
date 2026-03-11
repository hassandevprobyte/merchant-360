const Role = require("../models/Role");

exports.getAllRoles = async () => {
  return Role.find().sort({ title: 1 });
};

exports.getRolesWithPagination = async (filters, offset, pageSize) => {
  return Role.find(filters)
    .skip(offset)
    .limit(pageSize)
    .sort({ title: 1 })
    .lean();
};

exports.getRolesCount = async (filters) => {
  return Role.countDocuments(filters);
};

exports.getRoleById = async (roleId) => {
  return Role.findById(roleId);
};

exports.getRoleByTitle = async (title) => {
  return Role.findOne({ title });
};

exports.createRole = async (payload) => {
  return Role.create(payload);
};

exports.updateRoleById = async (roleId, payload) => {
  return Role.findByIdAndUpdate(roleId, payload);
};

exports.deleteRoleById = async (roleId) => {
  return Role.findByIdAndDelete(roleId);
};
