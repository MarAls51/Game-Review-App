const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const logger = require("./utils/logger");

dotenv.config({ path: "./config/.env" });

const searchRoutes = require("./routes/search");
const tldrRoutes = require("./routes/generalreview");
const userRoutes = require("./routes/user");
const steamRoutes = require("./routes/steamlogin");
const xboxRoutes = require("./routes/xboxscrape");
const personalReviewRoutes = require("./routes/personalizedReview");
const chartRoutes = require("./routes/chart");
const cognitoRoutes = require("./routes/cognito")

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_DB;

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.json());

app.use("/api", searchRoutes);
app.use("/api", tldrRoutes);
app.use("/api", userRoutes);
app.use("/api", steamRoutes);
app.use("/api", xboxRoutes);
app.use("/api", personalReviewRoutes);
app.use("/api", chartRoutes);
app.use("/api", cognitoRoutes)

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info("Connected to MongoDB!");

    app.listen(PORT, () => logger.info(`HTTP server running on port ${PORT}`));

  } catch (err) {
    logger.error("MongoDB Connection Error:", err);
    process.exit(1);
  }
}

startServer();