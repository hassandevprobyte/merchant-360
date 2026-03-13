require("dotenv").config();
const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// Returns a promise that resolves to an array of transactions
exports.getTransactions = async (filters) => {
  const transactions = [];

  const stream = gateway.transaction.search((search) => {
    search
      .status()
      .in([
        braintree.Transaction.Status.Settled,
        braintree.Transaction.Status.Settling,
        braintree.Transaction.Status.SubmittedForSettlement,
      ]);
  });

  return new Promise((resolve, reject) => {
    stream.on("data", (transaction) => {
      transactions.push(transaction);
    });

    stream.on("end", () => {
      resolve(transactions); // All transactions collected
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
};
