const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_DB;

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
}

module.exports = { connectDB };
