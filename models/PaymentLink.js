const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
      required: [true, "Merchant is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    linkId: {
      type: String,
      unique: true,
      required: [true, "Payment link is required"],
    },
    paymentLink: {
      type: String,
      unique: true,
      required: [true, "Payment link url is required"],
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    description: {
      type: String,
      trim: true,
    },
    metadata: {
      type: Map,
      default: {},
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PaymentLink", schema);
