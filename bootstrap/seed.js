const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Constants
const SCOPE = require("../constants/SCOPE");

exports.createSuperAdminRole = async () => {
  try {
    const roleExists = await mongoose.connection.db
      .collection("roles")
      .findOne({ title: "super admin" });

    if (!roleExists) {
      const modelNames = mongoose.modelNames();
      const excludeModelUpdateFields = ["_id", "__v", "updatedAt"];

      const modelUpdateFields = (modelName) =>
        Object.keys(mongoose.model(modelName).schema.paths).filter(
          (field) => !excludeModelUpdateFields.includes(field),
        );

      const actions = ["POST", "GET", "PATCH", "DELETE"];

      const permissions = modelNames.sort().map((modelName) => ({
        model: modelName,
        modelUpdateFields: modelUpdateFields(modelName),
        actions,
      }));

      const superAdminRolePayload = {
        title: "super admin",
        scope: SCOPE.ALL,
        indexPath: "/",
        permissions,
      };

      await mongoose.connection.db
        .collection("roles")
        .insertOne(superAdminRolePayload);
    }
  } catch (error) {
    console.error("Error creating super admin role:", error);
  }
};

exports.createSuperAdminUser = async () => {
  try {
    const superAdminUserPayload = {
      name: "super admin",
      email: "superadmin@siliconcrmlive.com",
      password: bcrypt.hashSync("Abcd1234", 10),
      isActive: true,
    };

    const roleExists = await mongoose.connection.db
      .collection("roles")
      .findOne({ title: "super admin" });

    if (!roleExists) {
      console.log(
        "Super admin role does not exist. Please create the role first.",
      );
      return;
    }

    const existingUser = await mongoose.connection.db
      .collection("users")
      .findOne({ email: superAdminUserPayload.email });

    if (!existingUser) {
      superAdminUserPayload.roleAndPermissions = roleExists._id;

      await mongoose.connection.db
        .collection("users")
        .insertOne(superAdminUserPayload);
    }
  } catch (error) {
    console.error("Error creating super admin user:", error);
  }
};
