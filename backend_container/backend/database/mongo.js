const mongoose = require("mongoose");
require("dotenv").config();
const logger = require('../utils/logger');

const MONGO_URI = process.env.MONGO_DB;

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info("Connected to MongoDB!"); 
  } catch (err) {
    logger.error("Error connecting to MongoDB:", err); 
    process.exit(1);
  }
}

module.exports = { connectDB };
