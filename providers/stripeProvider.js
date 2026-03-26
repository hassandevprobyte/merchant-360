const Boom = require("@hapi/boom");

const getStripe = (credentials) => {
  return require("stripe")(
    credentials?.stripeSecretKey || process.env.STRIPE_SECRET_KEY,
  );
};

exports.getTransactions = async (filters = {}, page = 1, pageSize = 50) => {
  const stripe = getStripe();
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

exports.createPaymentLink = async (amount, credentials, description) => {
  const stripe = getStripe(credentials);

  const price = await stripe.prices.create({
    unit_amount: amount * 100,
    currency: "USD",
    product_data: {
      name: description || "Payment",
    },
  });

  const paymentLink = await stripe.paymentLinks.create({
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
  });

  return {
    url: paymentLink.url,
    id: paymentLink.id,
  };
};

exports.refundPayment = async (amount, transactionId, credentials) => {
  const stripe = getStripe(credentials);

  if (!transactionId) {
    throw Boom.badRequest("Transaction ID is required");
  }

  // Retrieve the charge from Stripe
  const charge = await stripe.charges.retrieve(transactionId);

  if (!charge) {
    throw Boom.notFound("Transaction not found");
  }

  if (!charge.paid) {
    throw Boom.badRequest("Charge is not paid, cannot refund");
  }

  // Remaining refundable amount in cents
  const refundableAmount = charge.amount - charge.amount_refunded;

  let refundAmountInCents;

  // Validate amount
  if (amount !== undefined && amount !== null) {
    if (typeof amount !== "number" || isNaN(amount)) {
      throw Boom.badRequest("Amount must be a valid number");
    }

    if (amount <= 0) {
      throw Boom.badRequest("Amount must be greater than 0");
    }

    refundAmountInCents = Math.round(amount * 100);

    if (refundAmountInCents > refundableAmount) {
      throw Boom.badRequest(
        "Refund amount exceeds remaining refundable amount",
      );
    }
  }

  const refundParams = { charge: transactionId };

  if (refundAmountInCents) {
    refundParams.amount = refundAmountInCents;
  }

  const refund = await stripe.refunds.create(refundParams);

  return {
    provider: "stripe",
    refundId: refund.id,
    status: refund.status,
    amount: refund.amount / 100,
  };
};
