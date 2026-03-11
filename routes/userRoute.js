const express = require("express");
const router = express.Router();

// Controllers
const userController = require("../controllers/userController");

// Middlewares
const { checkPermissions } = require("../middlewares/checkPermissions");

router.use(checkPermissions("user"));
router
  .route("/")
  .get(userController.getUsersWithPagination)
  .post(userController.createUser);
router.get("/all", userController.getAllUsers);
router
  .route("/:id")
  .get(userController.getUserById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
