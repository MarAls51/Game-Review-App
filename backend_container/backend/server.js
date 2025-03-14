const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const logger = require("./utils/logger");
const MongoStore = require('connect-mongo');

dotenv.config({ path: "./config/.env" });

const searchRoutes = require("./routes/search");
const tldrRoutes = require("./routes/generalreview");
const userRoutes = require("./routes/user");
const steamRoutes = require("./routes/steamlogin");
const xboxRoutes = require("./routes/xboxscrape");
const personalReviewRoutes = require("./routes/personalizedReview");
const chartRoutes = require("./routes/chart");
const cognitoRoutes = require("./routes/cognito");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'lax'
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_DB,
    ttl: 14 * 24 * 60 * 60,
    autoRemove: 'native'
  })
}));

app.use("/api", searchRoutes);
app.use("/api", tldrRoutes);
app.use("/api", userRoutes);
app.use("/api", steamRoutes);
app.use("/api", xboxRoutes);
app.use("/api", personalReviewRoutes);
app.use("/api", chartRoutes);
app.use("/api", cognitoRoutes);

mongoose.connect(process.env.MONGO_DB, {
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});


app.listen(PORT, () => logger.info(`HTTP server running on port ${PORT}`));