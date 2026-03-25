// Constants
const COLUMNS = require("../constants/COLUMNS");

// Utils
const getValueByPath = require("../utils/getValuesByPath");

const formatAmount = (amount, provider) => {
  if (amount === null || amount === undefined) return null;

  if (provider === "stripe") {
    return (Number(amount) / 100).toFixed(2);
  }

  return Number(amount).toFixed(2);
};

const formatAccountNumber = (accountNumber) => {
  if (!accountNumber) return null;

  const digits = accountNumber.replace(/\D/g, "");
  const last4 = digits.slice(-4);
  return `${last4}`;
};

const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString();
};

exports.normalizeTransaction = (provider, transaction) => {
  const columns = COLUMNS[provider];

  return {
    provider,
    transactionId: getValueByPath(transaction, columns.transactionId) || "N/A",
    amount: formatAmount(getValueByPath(transaction, columns.amount), provider),
    status: getValueByPath(transaction, columns.status) || "N/A",
    transactionDate: formatDate(
      getValueByPath(transaction, columns.transactionDate),
    ),
    accountType:
      getValueByPath(transaction, columns.accountType).toUpperCase() || "N/A",
    last4:
      formatAccountNumber(getValueByPath(transaction, columns.last4)) || "N/A",
    // raw: transaction, // optional for debugging
  };
};

exports.applyFilters = (transactions, filters) => {
  if (!filters || Object.keys(filters).length === 0) return transactions;

  const startDate = filters.startDate ? new Date(filters.startDate) : null;
  const endDate = filters.endDate ? new Date(filters.endDate) : null;
  const minAmount = filters.minAmount ? Number(filters.minAmount) : null;
  const maxAmount = filters.maxAmount ? Number(filters.maxAmount) : null;
  const searchTerm = filters.search?.toString().toLowerCase() || null;
  const providerFilter = filters.provider?.toString().toLowerCase() || null;
  const statusFilter = filters.status?.toString().toLowerCase() || null;

  return transactions.filter((tx) => {
    const txAmount = Number(tx.amount);
    const txCreated = new Date(tx.createdAt);
    const txTransactionId = tx.transactionId?.toString().toLowerCase() || "";
    const txAccountType = tx.accountType?.toString().toLowerCase() || "";
    const txLast4 = tx.last4?.toString() || "";
    const txProvider = tx.provider?.toString().toLowerCase() || "";
    const txStatus = tx.status?.toString().toLowerCase() || "";

    if (statusFilter && txStatus !== statusFilter) return false;
    if (providerFilter && txProvider !== providerFilter) return false;
    if (startDate && txCreated < startDate) return false;
    if (endDate && txCreated > endDate) return false;
    if (minAmount !== null && txAmount < minAmount) return false;
    if (maxAmount !== null && txAmount > maxAmount) return false;
    if (searchTerm) {
      const found =
        txTransactionId.includes(searchTerm) ||
        txAccountType.includes(searchTerm) ||
        txLast4.includes(searchTerm) ||
        txProvider.includes(searchTerm);
      if (!found) return false;
    }

    return true;
  });
};

exports.applySorting = (transactions, sortBy, sortOrder) => {
  const order = sortOrder === "asc" ? 1 : -1;

  return transactions.sort((a, b) => {
    if (sortBy === "amount")
      return (Number(a.amount) - Number(b.amount)) * order;
    if (sortBy === "createdAt")
      return (new Date(a.createdAt) - new Date(b.createdAt)) * order;
    return new Date(b.createdAt) - new Date(a.createdAt); // default: createdAt DESC
  });
};

exports.applyPagination = (transactions, page = 1, pageSize = 50) => {
  const start = (page - 1) * pageSize;
  const data = transactions.slice(start, start + pageSize);

  return {
    data,
    meta: {
      total: transactions.length,
      pageSize,
      currentPage: page,
      hasMore: transactions.length > start + pageSize,
      nextPage: transactions.length > start + pageSize ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
    },
  };
};

exports.splitPageSize = (total, parts) => {
  const base = Math.floor(total / parts);
  const remainder = total % parts;

  return Array.from(
    { length: parts },
    (_, i) => base + (i < remainder ? 1 : 0),
  );
};
