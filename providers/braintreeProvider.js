require("dotenv").config();
const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

exports.getTransactions = async (filters = {}, page = 1, pageSize = 50) => {
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
