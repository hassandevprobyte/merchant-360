const express = require("express");
const router = express.Router();

// Providers
const stripeProvider = require("../providers/stripeProvider");
const brainTreeProvider = require("../providers/braintreeProvider");
const authorizeProvider = require("../providers/authorizeProvider");

router.route("/stripe").get(async (req, res) => {
  try {
    const transactions = await stripeProvider.getTransactions();

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.route("/braintree").get(async (req, res) => {
  try {
    const transactions = await brainTreeProvider.getTransactions();

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.route("/authorize").get(async (req, res) => {
  try {
    const transactions = await authorizeProvider.getTransactionList();

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
