const mongoose = require("mongoose");

// Constants
const MERCHANT_TYPES = require("../constants/MERCHANT_TYPES");

const MerchantSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, "title is required"],
    },
    type: {
      type: String,
      enum: Object.values(MERCHANT_TYPES),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Merchant", MerchantSchema);
