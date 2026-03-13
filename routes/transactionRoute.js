const express = require("express");
const router = express.Router();

// Providers
const stripeProvider = require("../providers/stripeProvider");
const brainTreeProvider = require("../providers/braintreeProvider");
const authorizeProvider = require("../providers/authorizeProvider");

router.route("/stripe").get(async (req, res) => {
  try {
    const StripeTransactions = await stripeProvider.getTransactions();

    res.status(200).json(StripeTransactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.route("/braintree").get(async (req, res) => {
  try {
    const BrainTreeTransactions = await brainTreeProvider.getTransactions();

    res.status(200).json(BrainTreeTransactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.route("/authorize").get(async (req, res) => {
  try {
    const AuthorizeTransactions = await authorizeProvider.getTransactions();

    res.status(200).json(AuthorizeTransactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.route("/").get(async (req, res) => {
  try {
    const StripeTransactions = await stripeProvider.getTransactions();
    const BrainTreeTransactions = await brainTreeProvider.getTransactions();
    const AuthorizeTransactions = await authorizeProvider.getTransactions();

    res
      .status(200)
      .json([
        ...StripeTransactions,
        ...BrainTreeTransactions,
        ...AuthorizeTransactions,
      ]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
