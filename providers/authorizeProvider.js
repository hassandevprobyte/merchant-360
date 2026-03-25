const ApiContracts = require("authorizenet").APIContracts;
const ApiControllers = require("authorizenet").APIControllers;

// Helpers
const authorizeHelper = require("../helpers/authorizeHelper");

async function getSettledBatches() {
  const merchantAuth = new ApiContracts.MerchantAuthenticationType();
  merchantAuth.setName(process.env.AUTHORIZE_NET_API_LOGIN_ID);
  merchantAuth.setTransactionKey(process.env.AUTHORIZE_NET_TRANSACTION_KEY);

  const request = new ApiContracts.GetSettledBatchListRequest();
  request.setMerchantAuthentication(merchantAuth);

  const response = new ApiContracts.GetSettledBatchListResponse(
    await authorizeHelper.executeController(
      ApiControllers.GetSettledBatchListController,
      request,
    ),
  );

  if (response.getMessages().getResultCode() !== "Ok") {
    throw new Error(response.getMessages().getMessage()[0].getText());
  }

  return response.getBatchList()?.getBatch() || [];
}

async function getTransactionsByBatch(batchId) {
  const merchantAuth = new ApiContracts.MerchantAuthenticationType();
  merchantAuth.setName(process.env.AUTHORIZE_NET_API_LOGIN_ID);
  merchantAuth.setTransactionKey(process.env.AUTHORIZE_NET_TRANSACTION_KEY);

  const request = new ApiContracts.GetTransactionListRequest();
  request.setMerchantAuthentication(merchantAuth);
  request.setBatchId(batchId);

  const response = new ApiContracts.GetTransactionListResponse(
    await authorizeHelper.executeController(
      ApiControllers.GetTransactionListController,
      request,
    ),
  );

  if (response.getMessages().getResultCode() !== "Ok") {
    throw new Error(response.getMessages().getMessage()[0].getText());
  }

  return response.getTransactions()?.getTransaction() || [];
}

async function getUnsettledTransactions() {
  const merchantAuth = new ApiContracts.MerchantAuthenticationType();
  merchantAuth.setName(process.env.AUTHORIZE_NET_API_LOGIN_ID);
  merchantAuth.setTransactionKey(process.env.AUTHORIZE_NET_TRANSACTION_KEY);

  const request = new ApiContracts.GetUnsettledTransactionListRequest();
  request.setMerchantAuthentication(merchantAuth);

  const response = new ApiContracts.GetUnsettledTransactionListResponse(
    await authorizeHelper.executeController(
      ApiControllers.GetUnsettledTransactionListController,
      request,
    ),
  );

  if (response.getMessages().getResultCode() !== "Ok") {
    throw new Error(response.getMessages().getMessage()[0].getText());
  }

  return response.getTransactions()?.getTransaction() || [];
}

const getTransactions = async (filters = {}, page = 1, pageSize = 50) => {
  const batches = await getSettledBatches();

  const batchPromises = batches.map((b) =>
    getTransactionsByBatch(b.getBatchId()),
  );
  const [batchTransactions, unsettled] = await Promise.all([
    Promise.all(batchPromises),
    getUnsettledTransactions(),
  ]);

  let allTransactions = [...batchTransactions.flat(), ...unsettled];

  // Apply filters inside provider
  if (filters.startDate)
    allTransactions = allTransactions.filter(
      (t) => new Date(t.getSubmitTimeUTC()) >= new Date(filters.startDate),
    );
  if (filters.endDate)
    allTransactions = allTransactions.filter(
      (t) => new Date(t.getSubmitTimeUTC()) <= new Date(filters.endDate),
    );
  if (filters.status)
    allTransactions = allTransactions.filter(
      (t) => t.getTransactionStatus() === filters.status,
    );

  // Page-based pagination
  const start = (page - 1) * pageSize;
  const paginated = allTransactions.slice(start, start + pageSize);

  return {
    data: paginated,
    meta: {
      pageSize,
      count: paginated.length,
      hasMore: allTransactions.length > start + pageSize,
      nextCursor: allTransactions.length > start + pageSize ? page + 1 : null,
      previousCursor: page > 1 ? page - 1 : null,
    },
  };
};

module.exports.getTransactions = getTransactions;
