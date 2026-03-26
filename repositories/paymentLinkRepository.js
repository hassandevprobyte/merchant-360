const PaymentLink = require("../models/PaymentLink");

exports.getPaymentLinksWithPagination = async (filters, offset, pageSize) => {
  return PaymentLink.find(filters)
    .skip(offset)
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .lean();
};

exports.getPaymentLinksCount = async (filters) => {
  return PaymentLink.countDocuments(filters);
};

exports.getPaymentLinkById = async (id) => {
  return PaymentLink.findById(id).lean();
};

exports.getPaymentLink = async (filters) => {
  return PaymentLink.findById(filters).lean();
};

exports.createPaymentLink = async (payload) => {
  return PaymentLink.create(payload);
};

exports.updatePaymentLink = async (filters, payload) => {
  return PaymentLink.findOneAndUpdate(filters, payload, { new: true }).lean();
};

exports.deletePaymentLink = async (filters) => {
  return PaymentLink.findOneAndDelete(filters);
};
