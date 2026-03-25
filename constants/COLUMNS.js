const MERCHANT_TYPES = require("./MERCHANT_TYPES");

const COLUMNS = {
  [MERCHANT_TYPES.STRIPE.type]: {
    transactionId: "balance_transaction",
    amount: "amount",
    status: "status",
    transactionDate: "created",
    accountType: [
      "payment_method_details.card.brand",
      "payment_method_details.us_bank_account.bank_name",
      "payment_method_details.bank_account.bank_name",
      "payment_method_details.wallet.type",
      "payment_method_details.type",
    ],
    last4: [
      "payment_method_details.card.last4",
      "payment_method_details.us_bank_account.last4",
      "payment_method_details.bank_account.last4",
    ],
  },

  [MERCHANT_TYPES.BRAINTREE.type]: {
    transactionId: "id",
    amount: "amount",
    status: "status",
    transactionDate: "createdAt",
    accountType: "creditCard.cardType",
    last4: "creditCard.last4",
  },

  [MERCHANT_TYPES.AUTHORIZE.type]: {
    transactionId: "transId",
    amount: "settleAmount",
    status: "transactionStatus",
    transactionDate: "submitTimeUTC",
    accountType: "accountType",
    last4: "accountNumber",
  },
};

module.exports = COLUMNS;
