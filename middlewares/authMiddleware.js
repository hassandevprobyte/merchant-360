const asyncHandler = require("express-async-handler");
const Boom = require("@hapi/boom");
const jwt = require("jsonwebtoken");

// Repositories
const userRepository = require("../repositories/userRepository");

// Constants
const message = require("../constants/MESSAGE");

// Environment variables
const { env } = require("../config");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw Boom.unauthorized(
      `${message.error.auth.unauthorized}, no token provided`,
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT.SECRET);

    req.user = await userRepository.getUserById(decoded.id);

    next();
  } catch (error) {
    console.log(error);

    throw Boom.unauthorized(message.error.auth.unauthorized);
  }
});

module.exports = protect;
