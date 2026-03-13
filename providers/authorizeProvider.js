const ApiContracts = require("authorizenet").APIContracts;
const ApiControllers = require("authorizenet").APIControllers;

// Helpers
const authorizeHelper = require("../helpers/authorizeHelper");

async function getSettledBatches() {
  const merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();

  merchantAuthenticationType.setName(process.env.AUTHORIZE_NET_API_LOGIN_ID);
  merchantAuthenticationType.setTransactionKey(
    process.env.AUTHORIZE_NET_TRANSACTION_KEY,
  );

  const request = new ApiContracts.GetSettledBatchListRequest();
  request.setMerchantAuthentication(merchantAuthenticationType);

  const apiResponse = await authorizeHelper.executeController(
    ApiControllers.GetSettledBatchListController,
    request,
  );

  const response = new ApiContracts.GetSettledBatchListResponse(apiResponse);

  if (response.getMessages().getResultCode() !== "Ok") {
    throw new Error(response.getMessages().getMessage()[0].getText());
  }

  const batchList = response.getBatchList();

  if (!batchList) return [];

  return batchList.getBatch() || [];
}

async function getTransactionsByBatch(batchId) {
  const merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();

  merchantAuthenticationType.setName(process.env.AUTHORIZE_NET_API_LOGIN_ID);
  merchantAuthenticationType.setTransactionKey(
    process.env.AUTHORIZE_NET_TRANSACTION_KEY,
  );

  const request = new ApiContracts.GetTransactionListRequest();
  request.setMerchantAuthentication(merchantAuthenticationType);
  request.setBatchId(batchId);

  const apiResponse = await authorizeHelper.executeController(
    ApiControllers.GetTransactionListController,
    request,
  );

  const response = new ApiContracts.GetTransactionListResponse(apiResponse);

  if (response.getMessages().getResultCode() !== "Ok") {
    throw new Error(response.getMessages().getMessage()[0].getText());
  }

  const txWrapper = response.getTransactions();

  if (!txWrapper) return [];

  return txWrapper.getTransaction() || [];
}

async function getUnsettledTransactions() {
  const merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();

  merchantAuthenticationType.setName(process.env.AUTHORIZE_NET_API_LOGIN_ID);
  merchantAuthenticationType.setTransactionKey(
    process.env.AUTHORIZE_NET_TRANSACTION_KEY,
  );

  const request = new ApiContracts.GetUnsettledTransactionListRequest();
  request.setMerchantAuthentication(merchantAuthenticationType);

  const apiResponse = await authorizeHelper.executeController(
    ApiControllers.GetUnsettledTransactionListController,
    request,
  );

  const response = new ApiContracts.GetUnsettledTransactionListResponse(
    apiResponse,
  );

  if (response.getMessages().getResultCode() !== "Ok") {
    throw new Error(response.getMessages().getMessage()[0].getText());
  }

  const txWrapper = response.getTransactions();

  if (!txWrapper) return [];

  return txWrapper.getTransaction() || [];
}

async function getTransactions() {
  const batches = await getSettledBatches();

  const batchPromises = batches.map((batch) =>
    getTransactionsByBatch(batch.getBatchId()),
  );

  const [batchTransactions, unsettled] = await Promise.all([
    Promise.all(batchPromises),
    getUnsettledTransactions(),
  ]);

  return [...batchTransactions.flat(), ...unsettled];
}

module.exports.getTransactions = getTransactions;
