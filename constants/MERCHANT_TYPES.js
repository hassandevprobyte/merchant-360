const MERCHANT_TYPES = {
  STRIPE: {
    type: "stripe",
    credentials: {
      stripeSecretKey: true,
      stripePublishKey: true,
    },
  },
  BRAINTREE: {
    type: "braintree",
    credentials: {
      merchantId: true,
      publicKey: true,
      privateKey: true,
    },
  },
  AUTHORIZE: {
    type: "authorize",
    credentials: {
      loginId: true,
      transactionKey: true,
    },
  },
  PAYPAL: {
    type: "paypal",
    credentials: {},
  },
};

module.exports = MERCHANT_TYPES;
