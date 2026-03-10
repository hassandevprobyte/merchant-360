const mongoose = require("mongoose");

// Environment variables
const { env } = require("./index");

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("Connected to MongoDB".bgGreen.white.bold);
  } catch (error) {
    console.error("Error connecting to MongoDB".red.bold, error);
    process.exit(1);
  }
};

module.exports = connectDB;
