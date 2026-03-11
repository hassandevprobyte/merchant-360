const User = require("../models/User");

const POPULATION_PIPELINE = [
  { path: "roleAndPermissions" },
];

exports.getAllUsers = async (filters) => {
  return User.find(filters, "-password")
    .sort({ name: 1 })
    .populate(POPULATION_PIPELINE)
    .lean();
};
exports.getUsersWithPagination = async (filters, offset, pageSize) => {
  return User.find(filters, "-password")
    .skip(offset)
    .limit(pageSize)
    .sort({ name: 1 })
    .populate(POPULATION_PIPELINE)
    .lean();
};

exports.getUsersCount = async (filters) => {
  return User.countDocuments(filters);
};

exports.getUserById = async (userId) => {
  return User.findById(userId, "-password")
    .populate(POPULATION_PIPELINE)
    .lean();
};

exports.getUserPasswordById = async (userId) => {
  const user = await User.findById(userId, "password");

  return user ? user.password : null;
};

exports.getUserByIdAndBrandId = async (userId, brandId) => {
  return User.findOne({ _id: userId, brands: brandId });
};

exports.getUserByEmail = async (email) => {
  return User.findOne({ email });
};

exports.getUserByBrandId = async (brandId) => {
  return User.findOne({ brands: brandId });
};

exports.getUserByRoleId = async (roleId) => {
  return User.findOne({ roleAndPermissions: roleId });
};

exports.getUserByDepartmentId = async (departmentId) => {
  return User.findOne({ department: departmentId });
};

exports.getUsersByIds = async (userIds) => {
  return User.find({ _id: { $in: userIds } });
};

exports.createUser = async (payload) => {
  return User.create(payload);
};

exports.updateUserById = async (userId, payload) => {
  return User.findByIdAndUpdate(userId, payload);
};

exports.deleteUserById = async (userId) => {
  return User.findByIdAndDelete(userId);
};
