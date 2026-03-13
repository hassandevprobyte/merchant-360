// Validations
const joi = require("../validations/joi");
const merchantValidation = require("../validations/merchant");
const joiSchema = require("../validations/joi/schema/merchant");

// repositories
const merchantRepository = require("../repositories/merchantRepository");

exports.getAllMerchants = async (filters) => {
  return merchantRepository.getAllMerchants(filters);
};

exports.getMerchantsWithPagination = async (payload) => {
  const { filters, page, pageSize } = payload;
  const offset = (page - 1) * pageSize;

  const merchants = await merchantRepository.getMerchantsWithPagination(
    filters,
    offset,
    pageSize,
  );
  const merchantCount = await merchantRepository.getMerchantsCount(filters);

  const meta = {
    totalCount: merchantCount,
    totalPages: Math.ceil(merchantCount / pageSize),
    page,
    pageSize,
  };

  return { data: merchants, meta };
};

exports.getMerchantById = async (merchantId) => {
  joi.validate(merchantId, joiSchema.getMerchantById);

  return merchantValidation.throwErrorIfMerchantDoesNotExists(merchantId);
};

exports.createMerchant = async (payload) => {
  const validatedPayload = joi.validate(payload, joiSchema.createMerchant);

  await merchantValidation.throwErrorIfMerchantTitleAlreadyExists(
    validatedPayload.title,
  );

  const createPayload = { ...validatedPayload };

  return merchantRepository.createMerchant(createPayload);
};

exports.updateMerchant = async (payload) => {
  const validatedPayload = joi.validate(payload, joiSchema.updateMerchant);

  const existingMerchant =
    await merchantValidation.throwErrorIfMerchantDoesNotExists(
      validatedPayload.id,
    );

  const updatePayload = {};

  if (
    validatedPayload.title &&
    validatedPayload.title !== existingMerchant.title
  ) {
    await merchantValidation.throwErrorIfMerchantTitleAlreadyExists(
      validatedPayload.title,
    );

    updatePayload.title = validatedPayload.title;
  }

  if (
    validatedPayload.type &&
    validatedPayload.type !== existingMerchant.type
  ) {
    updatePayload.type = validatedPayload.type;
  }

  if (
    validatedPayload.isActive &&
    validatedPayload.isActive !== existingMerchant.isActive
  ) {
    updatePayload.isActive = validatedPayload.isActive;
  }

  const updateFilters = { _id: validatedPayload.id };
  return merchantRepository.updateMerchant(updateFilters, updatePayload);
};
