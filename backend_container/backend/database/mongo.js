const mongoose = require("mongoose");
require("dotenv").config();
const logger = require('../utils/logger');
const fs = require('fs');

const MONGO_URI = fs.readFileSync('/run/secrets/MONGO_DB', 'utf8').trim();

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
