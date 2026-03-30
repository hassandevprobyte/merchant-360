const Boom = require("@hapi/boom");
const ApiContracts = require("authorizenet").APIContracts;
const ApiControllers = require("authorizenet").APIControllers;

// Helpers
const authorizeHelper = require("../helpers/authorizeHelper");

const getAuthorize = (credentials) => {
  const merchantAuth = new ApiContracts.MerchantAuthenticationType();
  merchantAuth.setName(
    credentials?.loginId || process.env.AUTHORIZE_NET_API_LOGIN_ID,
  );
  merchantAuth.setTransactionKey(
    credentials?.transactionKey || process.env.AUTHORIZE_NET_TRANSACTION_KEY,
  );

  return merchantAuth;
};

async function getSettledBatches(credentials) {
  const merchantAuth = getAuthorize(credentials);

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

async function getTransactionsByBatch(batchId, credentials) {
  const merchantAuth = getAuthorize(credentials);

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

async function getUnsettledTransactions(credentials) {
  const merchantAuth = getAuthorize(credentials);

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

exports.getTransactions = async (
  filters = {},
  page = 1,
  pageSize = 50,
  credentials,
) => {
  const batches = await getSettledBatches(credentials);

  const batchPromises = batches.map((b) =>
    getTransactionsByBatch(b.getBatchId(), credentials),
  );
  const [batchTransactions, unsettled] = await Promise.all([
    Promise.all(batchPromises),
    getUnsettledTransactions(credentials),
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

exports.createPaymentLink = async (amount, credentials) => {
  try {
    const merchantAuth = getAuthorize(credentials);

    const transactionRequest = new ApiContracts.TransactionRequestType();
    transactionRequest.setTransactionType("authCaptureTransaction");
    transactionRequest.setAmount(amount);

    const request = new ApiContracts.GetHostedPaymentPageRequest();
    request.setMerchantAuthentication(merchantAuth);
    request.setTransactionRequest(transactionRequest);

    return new Promise((resolve, reject) => {
      const ctrl = new ApiControllers.GetHostedPaymentPageController(
        request.getJSON(),
      );

      ctrl.execute(() => {
        const response = new ApiContracts.GetHostedPaymentPageResponse(
          ctrl.getResponse(),
        );

        if (response.getMessages().getResultCode() === "Ok") {
          const token = response.getToken();

          resolve({
            url: `https://accept.authorize.net/payment/payment?token=${token}`,
            token,
          });
        } else {
          reject(response.getMessages().getMessage()[0].getText());
        }
      });
    });
  } catch (error) {
    throw Boom.badRequest(error.message || "Something went wrong");
  }
};

exports.refundPayment = async (amount, transactionId, credentials) => {
  const merchantAuth = getAuthorize(credentials);

  if (!transactionId) {
    throw Boom.badRequest("Transaction ID is required");
  }

  // Step 1: Fetch transaction details
  const getRequest = new ApiContracts.GetTransactionDetailsRequest();
  getRequest.setMerchantAuthentication(merchantAuth);
  getRequest.setTransId(transactionId);

  const getResponseRaw = await authorizeHelper.executeController(
    ApiControllers.GetTransactionDetailsController,
    getRequest,
  );

  const getResponse = new ApiContracts.GetTransactionDetailsResponse(
    getResponseRaw,
  );

  if (getResponse.getMessages().getResultCode() !== "Ok") {
    throw Boom.notFound("Transaction not found");
  }

  const transaction = getResponse.getTransaction();

  // Step 2: Validate transaction status
  const status = transaction.getTransactionStatus();

  if (status !== "settledSuccessfully") {
    throw Boom.badRequest(
      `Transaction not eligible for refund. Status: ${status}`,
    );
  }

  const totalAmount = parseFloat(transaction.getSettleAmount());

  // Step 3: Calculate already refunded amount
  const refundedAmount = transaction.getRefunds()
    ? transaction
        .getRefunds()
        .reduce((sum, refund) => sum + parseFloat(refund.getRefundAmount()), 0)
    : 0;

  const refundableAmount = totalAmount - refundedAmount;

  let refundAmount = totalAmount;

  // Step 4: Validate amount
  if (amount !== undefined && amount !== null) {
    if (typeof amount !== "number" || isNaN(amount)) {
      throw Boom.badRequest("Amount must be a valid number");
    }

    if (amount <= 0) {
      throw Boom.badRequest("Amount must be greater than 0");
    }

    if (amount > refundableAmount) {
      throw Boom.badRequest(
        "Refund amount exceeds remaining refundable amount",
      );
    }

    refundAmount = amount;
  }

  // Step 5: Extract card info (REQUIRED for refund)
  const payment = new ApiContracts.PaymentType();
  const creditCard = new ApiContracts.CreditCardType();

  const cardNumber = transaction.getPayment().getCreditCard().getCardNumber(); // e.g. XXXX1111

  const last4 = cardNumber.slice(-4);

  creditCard.setCardNumber(last4);
  creditCard.setExpirationDate("XXXX");

  payment.setCreditCard(creditCard);

  // Step 6: Create refund transaction
  const transactionRequest = new ApiContracts.TransactionRequestType();
  transactionRequest.setTransactionType(
    ApiContracts.TransactionTypeEnum.REFUNDTRANSACTION,
  );
  transactionRequest.setRefTransId(transactionId);
  transactionRequest.setAmount(refundAmount);
  transactionRequest.setPayment(payment);

  const request = new ApiContracts.CreateTransactionRequest();
  request.setMerchantAuthentication(merchantAuth);
  request.setTransactionRequest(transactionRequest);

  const responseRaw = await authorizeHelper.executeController(
    ApiControllers.CreateTransactionController,
    request,
  );

  const result = new ApiContracts.CreateTransactionResponse(responseRaw);

  if (result.getMessages().getResultCode() !== "Ok") {
    throw Boom.badRequest(result.getMessages().getMessage()[0].getText());
  }

  const refundTransaction = result.getTransactionResponse();

  return {
    provider: "authorize",
    refundId: refundTransaction.getTransId(),
    status: refundTransaction.getResponseCode(),
    amount: refundAmount,
  };
};

exports.getRefundsByMerchantId = async (
  credentials,
  filters = {},
  page = 1,
  pageSize = 50,
) => {
  // Fetch settled and unsettled transactions
  const batches = await getSettledBatches(credentials);

  const batchPromises = batches.map((b) =>
    getTransactionsByBatch(b.getBatchId(), credentials),
  );

  const [batchTransactions, unsettled] = await Promise.all([
    Promise.all(batchPromises),
    getUnsettledTransactions(credentials),
  ]);

  let allTransactions = [...batchTransactions.flat(), ...unsettled];

  // ✅ Filter ONLY refunds
  let refunds = allTransactions.filter(
    (t) => t.transactionType === "refundTransaction",
  );

  // Apply filters
  if (filters.startDate) {
    refunds = refunds.filter(
      (t) => new Date(t.submitTimeUTC) >= new Date(filters.startDate),
    );
  }

  if (filters.endDate) {
    refunds = refunds.filter(
      (t) => new Date(t.submitTimeUTC) <= new Date(filters.endDate),
    );
  }

  if (filters.status) {
    refunds = refunds.filter((t) => t.transactionStatus === filters.status);
  }

  // Pagination
  const start = (page - 1) * pageSize;
  const paginated = refunds.slice(start, start + pageSize);

  return {
    data: paginated.map((t) => ({
      provider: "authorize",
      refundId: t.transId,
      transactionId: t.refTransId,
      amount: parseFloat(t.settleAmount || 0),
      status: t.transactionStatus,
      createdAt: t.submitTimeUTC,
    })),
    meta: {
      pageSize,
      count: paginated.length,
      total: refunds.length,
      hasMore: refunds.length > start + pageSize,
      nextCursor: refunds.length > start + pageSize ? page + 1 : null,
      previousCursor: page > 1 ? page - 1 : null,
    },
  };
};

exports.getRefundsByTransactionId = async (transactionId, credentials) => {
  const merchantAuth = getAuthorize(credentials);

  if (!transactionId) {
    throw Boom.badRequest("Transaction ID is required");
  }

  const request = new ApiContracts.GetTransactionDetailsRequest();
  request.setMerchantAuthentication(merchantAuth);
  request.setTransId(transactionId);

  const responseRaw = await authorizeHelper.executeController(
    ApiControllers.GetTransactionDetailsController,
    request,
  );

  const response = new ApiContracts.GetTransactionDetailsResponse(responseRaw);

  if (response.getMessages().getResultCode() !== "Ok") {
    throw Boom.notFound("Transaction not found");
  }

  const transaction = response.getTransaction();
  const refunds = transaction.getRefunds() || [];

  return refunds.map((refund) => ({
    provider: "authorize",
    refundId: refund.getRefundId(),
    transactionId: transactionId,
    amount: parseFloat(refund.getRefundAmount()),
    status: refund.getRefundStatus(),
    currency: transaction.getCurrencyCode(),
    createdAt: refund.getSubmitTimeUTC(),
  }));
};
