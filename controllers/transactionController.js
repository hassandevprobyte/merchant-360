const asyncHandler = require("express-async-handler");

// Services
const transactionService = require("../services/transactionService");

exports.getAllTransactions = asyncHandler(async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      provider,
      status,
      search,
      minAmount,
      maxAmount,
      sortBy,
      sortOrder,
      page,
      pageSize,
    } = req.query;

    const filters = {
      startDate,
      endDate,
      provider,
      status,
      search,
      minAmount,
      maxAmount,
      sortBy,
      sortOrder,
    };

    const result = await transactionService.getAllTransactions(
      filters,
      Number(page) || 1,
      Number(pageSize) || 50,
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
