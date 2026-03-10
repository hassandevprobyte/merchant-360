const mongoose = require("mongoose");

// Environment variables
const  env  = require("./env");

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("Connected to database".bgGreen.white.bold);
  } catch (error) {
    console.error("Error connecting to database".bgRed.white.bold, error);
    process.exit(1);
  }
};

module.exports = connectDB;
