exports.collectBraintreeResults = async (collection) => {
  const results = [];

  // If the collection has a .stream() method (older SDK)
  if (typeof collection.stream === "function") {
    await new Promise((resolve, reject) => {
      const stream = collection.stream();
      stream.on("data", (item) => results.push(item));
      stream.on("end", resolve);
      stream.on("error", reject);
    });
  }

  return results;
};
