const asyncHandler = require("express-async-handler");

// Services
const userService = require("../services/userService");

// Utilities
const transformQueryParams = require("../utils/transformQueryToMongooseSyntax");

// Scope
const userScope = require("../scopes/userScope");

// @desc    Get all users
// @route   GET /api/v1/users/all
// @access  Private
exports.getAllUsers = asyncHandler(async (req, res) => {
  const scopeQuery = userScope.scope(
    req.user,
    req.query?.query?.roleAndPermissions,
  );

  const filters = transformQueryParams("User", {
    ...scopeQuery,
    ...req.query.query,
  });

  const data = await userService.getAllUsers(filters);

  res.status(200).json(data);
});

// @desc    Get users with pagination
// @route   GET /api/v1/users
// @access  Private
exports.getUsersWithPagination = asyncHandler(async (req, res) => {
  const scopeQuery = userScope.scope(req.user);

  const payload = {
    filters: transformQueryParams("User", {
      ...scopeQuery,
      ...req.query.query,
    }),
    page: parseInt(req.query.page) || 1,
    pageSize: parseInt(req.query.pageSize) || 10,
  };

  const data = await userService.getUsersWithPagination(payload);

  res.status(200).json(data);
});

// @desc    Get user by id
// @route   GET /api/v1/users/:id
// @access  Private
exports.getUserById = asyncHandler(async (req, res) => {
  await userScope.authorizeByScope(req.user, req.params.id);

  const data = await userService.getUserById(req.params.id);

  res.status(200).json(data);
});

// @desc    Create a new user
// @route   POST /api/v1/users
// @access  Private
exports.createUser = asyncHandler(async (req, res) => {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    roleAndPermissions: req.body.roleAndPermissions,
    isActive: req.body.isActive,
  };

  const data = await userService.createUser(payload);

  res.status(201).json(data);
});

// @desc    Update user
// @route   PATCH /api/v1/users/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res) => {
  await userScope.authorizeByScope(req.user, req.params.id);

  const payload = {
    id: req.params.id,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    roleAndPermissions: req.body.roleAndPermissions,
    isActive: req.body.isActive,
  };

  const data = await userService.updateUser(payload);

  res.status(200).json(data);
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private
exports.deleteUser = asyncHandler(async (req, res) => {
  await userScope.authorizeByScope(req.user, req.params.id);

  const data = await userService.deleteUser(req.params.id);

  res.status(200).json(data);
});
