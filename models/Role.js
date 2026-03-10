const mongoose = require("mongoose");

// Constants
const SCOPE = require("../constants/SCOPE");

const RoleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
      lowercase: true,
      unique: true,
    },
    permissions: [
      {
        _id: false,
        model: {
          type: String,
          required: [true, "model is required"],
          trim: true,
        },
        actions: [
          {
            type: String,
            enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            required: [true, "actions are required"],
            trim: true,
            uppercase: true,
          },
        ],
        modelUpdateFields: {
          type: [String],
        },
      },
    ],
    scope: {
      type: String,
      enum: [SCOPE.OWN, SCOPE.BRAND, SCOPE.ALL],
      required: [true, "scope is required"],
      trim: true,
      lowercase: true,
    },
    indexPath: {
      type: String,
      required: [true, "scope is required"],
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Role", RoleSchema);
