const { connectDB } = require("../config");
const seed = require("./seed");

const bootstrap = async () => {
  await connectDB();

  await seed.createSuperAdminRole();
  await seed.createSuperAdminUser();

  console.log("App bootstrapped successfully".bgGreen.white.bold);
};

module.exports = bootstrap;
