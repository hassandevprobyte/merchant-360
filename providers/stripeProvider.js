const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getTransactions = async (filters = {}, page = 1, pageSize = 50) => {
  const params = { limit: pageSize };

  if (filters.startDate || filters.endDate) {
    params.created = {};
    if (filters.startDate)
      params.created.gte = Math.floor(
        new Date(filters.startDate).getTime() / 1000,
      );
    if (filters.endDate)
      params.created.lte = Math.floor(
        new Date(filters.endDate).getTime() / 1000,
      );
  }

  // Simulate page for Stripe cursor
  if (page > 1) {
    const prev = await stripe.charges.list({ limit: (page - 1) * pageSize });
    const last = prev.data[prev.data.length - 1];
    if (last) params.starting_after = last.id;
  }

  const response = await stripe.charges.list(params);

  return {
    data: response.data,
    meta: {
      pageSize,
      hasMore: response.has_more,
      nextCursor: response.has_more ? page + 1 : null,
      previousCursor: page > 1 ? page - 1 : null,
    },
  };
};
