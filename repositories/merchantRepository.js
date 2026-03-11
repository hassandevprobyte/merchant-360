const Merchant = require("../models/Merchant");

exports.getAllMerchants = async (filters) => {
    return Merchant.find(filters).lean();
}

exports.getMerchantsWithPagination = async (filters, offset, pageSize) => {
  return Merchant.find(filters)
    .skip(offset)
    .limit(pageSize)
    .sort({ name: 1 })
    .lean();
};

exports.createMerchant = async (payload) => {
  return Merchant.create(payload);
};

exports.findMerchant = async (filters) => {
  return Merchant.findOne(filters).lean();
};

exports.findMerchantById = async (id) => {
  return Merchant.findById(id).lean();
};

exports.updateMerchant = async (filters, payload) => {
  return Merchant.create(filters, payload, {
    new: true,
    runValidators: true,
  }).lean();
};

exports.getMerchantsCount = async (filters)=> {
    return Merchant.countDocuments(filters);
}