const express = require("express");
const router = express.Router();

// Controllers
const transactionController = require("../controllers/transactionController");

// Providers
const stripeProvider = require("../providers/stripeProvider");
const brainTreeProvider = require("../providers/braintreeProvider");
const authorizeProvider = require("../providers/authorizeProvider");

router.route("/stripe").get(async (req, res) => {
  try {
    const { startDate, endDate, cursor, pageSize } = req.query;

    const filters = {
      startDate,
      endDate,
    };

    const stripeTransactions = await stripeProvider.getTransactions(
      filters,
      cursor,
      Number(pageSize) || 100,
    );

    res.status(200).json(stripeTransactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.route("/braintree").get(async (req, res) => {
  try {
    const { startDate, endDate, cursor, pageSize } = req.query;

    const transactions = await brainTreeProvider.getTransactions(
      { startDate, endDate },
      Number(cursor) || 1,
      Number(pageSize) || 50,
    );

    res.status(200).json(transactions);
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

router.route("/").get(transactionController.getAllTransactions);

module.exports = router;
