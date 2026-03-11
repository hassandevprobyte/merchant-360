const express = require("express");
const router = express.Router();

// Controllers
const roleController = require("../controllers/roleController");

// Middlewares
const { checkPermissions } = require("../middlewares/checkPermissions");

router.use(checkPermissions("role"));
router
  .route("/")
  .get(roleController.getAllRoles)
  .post(roleController.createRole);
router.get("/models", roleController.getAllModels);
router
  .route("/:id")
  .get(roleController.getRoleById)
  .patch(roleController.updateRole)
  .delete(roleController.deleteRole);

module.exports = router;
