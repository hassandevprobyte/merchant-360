// Providers
const stripeProvider = require("../providers/stripeProvider");
const brainTreeProvider = require("../providers/braintreeProvider");
const authorizeProvider = require("../providers/authorizeProvider");

// Helpers
const transactionHelper = require("../helpers/transactionHelper");

// Constants
const MERCHANT_TYPES = require("../constants/MERCHANT_TYPES");

exports.getAllTransactions = async (filters = {}, page = {}, pageSize = 50) => {
  const [stripeSize, braintreeSize, authorizeSize] =
    transactionHelper.splitPageSize(pageSize, 3);

  const stripePage = page?.stripe || 1;
  const braintreePage = page?.braintree || 1;
  const authorizePage = page?.authorize || 1;

  const [stripeRes, braintreeRes, authorizeRes] = await Promise.all([
    stripeProvider.getTransactions(filters, stripePage, stripeSize),
    brainTreeProvider.getTransactions(filters, braintreePage, braintreeSize),
    authorizeProvider.getTransactions(filters, authorizePage, authorizeSize),
  ]);

  // Normalize
  const normalize = (res, type) =>
    res.data.map((t) => transactionHelper.normalizeTransaction(type, t));

  const allTransactions = [
    ...normalize(stripeRes, MERCHANT_TYPES.STRIPE.type),
    ...normalize(braintreeRes, MERCHANT_TYPES.BRAINTREE.type),
    ...normalize(authorizeRes, MERCHANT_TYPES.AUTHORIZE.type),
  ];

  return {
    data: allTransactions,
    meta: {
      pageSize,
      nextPage: {
        stripe: stripeRes.meta.nextCursor,
        braintree: braintreeRes.meta.nextCursor,
        authorize: authorizeRes.meta.nextCursor,
      },
      previousPage: {
        stripe: stripeRes.meta.previousCursor,
        braintree: braintreeRes.meta.previousCursor,
        authorize: authorizeRes.meta.previousCursor,
      },
      hasMore:
        stripeRes.meta.hasMore ||
        braintreeRes.meta.hasMore ||
        authorizeRes.meta.hasMore,
    },
  };
};
