const { env } = require("../config");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getTransactions = async (filters, offset, pageSize) => {
  const transactions = await stripe.balanceTransactions.list({
    limit: pageSize || 100,
  });

  return transactions.data;
};
