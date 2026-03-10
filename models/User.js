const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email is required"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    brands: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: [true, "brands are required"],
      },
    ],
    usesBrandAliases: {
      type: Boolean,
      default: false,
    },
    brandAliases: [
      {
        _id: false,
        brand: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Brand",
        },
        name: {
          type: String,
          lowercase: true,
          trim: true,
        },
        email: {
          type: String,
          lowercase: true,
          trim: true,
        },
      },
    ],
    roleAndPermissions: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: [true, "role and permissions is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
