require("dotenv").config();
const Boom = require("@hapi/boom");
const braintree = require("braintree");

// Helpers
const braintreeHelper = require("../helpers/braintreeHelper");

const getBraintree = (credentials) => {
  return new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: credentials?.merchantId || process.env.BRAINTREE_MERCHANT_ID,
    publicKey: credentials?.publicKey || process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: credentials?.privateKey || process.env.BRAINTREE_PRIVATE_KEY,
  });
};

exports.getTransactions = async (filters = {}, page = 1, pageSize = 50) => {
  const gateway = getBraintree();
  return new Promise((resolve, reject) => {
    const transactions = [];
    const skip = (page - 1) * pageSize;
    let index = 0;

    const stream = gateway.transaction.search((search) => {
      search
        .status()
        .in([
          braintree.Transaction.Status.Settled,
          braintree.Transaction.Status.Settling,
          braintree.Transaction.Status.SubmittedForSettlement,
        ]);

      if (filters.startDate)
        search.createdAt().min(new Date(filters.startDate));
      if (filters.endDate) search.createdAt().max(new Date(filters.endDate));
      if (filters.status) search.status().in([filters.status]);
    });

    stream.on("data", (transaction) => {
      if (index >= skip && transactions.length < pageSize) {
        transactions.push(transaction);
      }
      index++;
      if (transactions.length === pageSize) stream.pause();
    });

    stream.on("end", () =>
      resolve({
        data: transactions,
        meta: {
          pageSize,
          hasMore: index > page * pageSize,
          nextCursor: transactions.length === pageSize ? page + 1 : null,
          previousCursor: page > 1 ? page - 1 : null,
        },
      }),
    );

    stream.on("error", reject);
  });
};

exports.createPaymentLink = async (amount, credentials) => {
  try {
    const gateway = getBraintree(credentials);

    const clientToken = await gateway.clientToken.generate({});

    return {
      clientToken: clientToken.clientToken,
      amount,
    };
  } catch (error) {
    throw Boom.badRequest(error.message || "Something went wrong");
  }
};

exports.refundPayment = async (amount, transactionId, credentials) => {
  const gateway = getBraintree(credentials);

  if (!transactionId) {
    throw Boom.badRequest("Transaction ID is required");
  }

  // Find the transaction first
  const transaction = await gateway.transaction.find(transactionId);

  if (!transaction) {
    throw Boom.notFound("Transaction not found");
  }

  // Only settled or settling transactions can be refunded
  if (transaction.status !== "settled" && transaction.status !== "settling") {
    throw Boom.badRequest(
      `Transaction cannot be refunded. Status: ${transaction.status}`,
    );
  }

  const totalAmount = parseFloat(transaction.amount);

  // Calculate already refunded amount
  const refundedAmount = transaction.refunds
    ? transaction.refunds.reduce(
        (sum, refund) => sum + parseFloat(refund.amount),
        0,
      )
    : 0;

  const refundableAmount = totalAmount - refundedAmount;

  let refundAmount;

  // Validate amount
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

    refundAmount = amount.toFixed(2);
  }

  // Refund transaction
  return new Promise((resolve, reject) => {
    gateway.transaction.refund(transactionId, refundAmount, (err, result) => {
      if (err) return reject(err);
      if (!result.success) return reject(Boom.badRequest(result.message));

      resolve({
        provider: "braintree",
        refundId: result.transaction.id,
        status: result.transaction.status,
        amount: parseFloat(result.transaction.amount),
      });
    });
  });
};

exports.getRefundsByMerchantId = async (
  credentials,
  filters = {},
  page = 1,
  pageSize = 50,
) => {
  const gateway = getBraintree(credentials);

  // Search only refund transactions
  const collection = await gateway.transaction.search((search) => {
    search.type().is("credit");

    if (filters.startDate && filters.endDate) {
      search
        .createdAt()
        .between(new Date(filters.startDate), new Date(filters.endDate));
    }

    if (filters.transactionId) {
      search.refundedTransactionId().is(filters.transactionId);
    }
  });

  // Collect transactions from collection
  const transactions =
    await braintreeHelper.collectBraintreeResults(collection);

  // Map refunds into unified format
  let refunds = transactions.map((transaction) => ({
    provider: "braintree",
    refundId: transaction.id,
    transactionId: transaction.refundedTransactionId,
    amount: parseFloat(transaction.amount),
    status: transaction.status,
    currency: transaction.currencyIsoCode,
    createdAt: transaction.createdAt,
  }));

  // Additional Filters
  if (filters.status) {
    refunds = refunds.filter((r) => r.status === filters.status);
  }

  // Pagination
  const start = (page - 1) * pageSize;
  const paginated = refunds.slice(start, start + pageSize);

  return {
    data: paginated,
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
  const gateway = getBraintree(credentials);

  if (!transactionId) {
    throw Boom.badRequest("Transaction ID is required");
  }

  const transaction = await gateway.transaction.find(transactionId);

  if (!transaction) {
    throw Boom.notFound("Transaction not found");
  }

  const refunds = transaction.refunds || [];

  return refunds.map((refund) => ({
    provider: "braintree",
    refundId: refund.id,
    transactionId: refund.refundedTransactionId,
    amount: parseFloat(refund.amount),
    status: refund.status,
    currency: refund.currencyIsoCode,
    createdAt: refund.createdAt,
  }));
};
