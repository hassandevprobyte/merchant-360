const asyncHandler = require("express-async-handler");

// Services
const authService = require("../services/authService");

// @desc    Authenticate user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const payload = {
    email: req.body.email,
    password: req.body.password,
  };

  const data = await authService.login(payload);

  res.status(200).json(data);
});

// @desc    Refresh auth token
// @route   GET /api/v1/auth/refresh
// @access  Public
exports.refresh = asyncHandler(async (req, res) => {
  const { accessToken } = await authService.refresh(req.cookies);

  res.status(200).json({ accessToken });
});

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Public
exports.logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204);

  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({ message: "Cookie cleared" });
});

// @desc    Change user password
// @route   PATCH /api/v1/auth/changePassword
// @access  Private
exports.changePassword = asyncHandler(async (req, res) => {
  const payload = {
    id: req.user._id,
    oldPassword: req.body.oldPassword,
    newPassword: req.body.newPassword,
  };

  const user = await authService.changePassword(payload);

  res.status(200).json(user);
});
