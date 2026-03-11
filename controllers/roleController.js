const asyncHandler = require("express-async-handler");

// Services
const roleService = require("../services/roleService");

// @desc    Get all roles
// @route   GET /api/v1/roles
// @access  private
exports.getAllRoles = asyncHandler(async (req, res) => {
  const data = await roleService.getAllRoles();

  res.status(200).json(data);
});

// @desc    Get all models
// @route   GET /api/v1/roles/models
// @access  private
exports.getAllModels = asyncHandler(async (req, res) => {
  const data = roleService.getAllModels();

  res.status(200).json(data);
});

// @desc    Get role by id
// @route   GET /api/v1/roles/:id
// @access  private
exports.getRoleById = asyncHandler(async (req, res) => {
  const data = await roleService.getRoleById(req.params.id);

  res.status(200).json(data);
});

// @desc    Create new role
// @route   POST /api/v1/roles
// @access  private
exports.createRole = asyncHandler(async (req, res) => {
  const payload = {
    title: req.body.title,
    permissions: req.body.permissions,
    scope: req.body.scope,
    indexPath: req.body.indexPath,
  };

  const data = await roleService.createRole(payload);

  res.status(201).json(data);
});

// @desc    Update role
// @route   PATCH /api/v1/roles/:id
// @access  private
exports.updateRole = asyncHandler(async (req, res) => {
  const payload = {
    id: req.params.id,
    title: req.body.title,
    permissions: req.body.permissions,
    scope: req.body.scope,
    indexPath: req.body.indexPath,
  };

  const data = await roleService.updateRole(payload);

  res.status(200).json(data);
});

// @desc    Delete role
// @route   DELETE /api/v1/roles/:id
// @access  private
exports.deleteRole = asyncHandler(async (req, res) => {
  const data = await roleService.deleteRole(req.params.id);

  res.status(200).json(data);
});
