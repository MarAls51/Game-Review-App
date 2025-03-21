const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const logger = require("./utils/logger");
const MongoStore = require('connect-mongo');
const fs = require('fs');

const SESSION_SECRET = fs.readFileSync('/run/secrets/SESSION_SECRET', 'utf8').trim();
const MONGO_DB = fs.readFileSync('/run/secrets/MONGO_DB', 'utf8').trim();
const PORT = 5000;

const searchRoutes = require("./routes/search");
const tldrRoutes = require("./routes/generalreview");
const userRoutes = require("./routes/user");
const steamRoutes = require("./routes/steamlogin");
const xboxRoutes = require("./routes/xboxscrape");
const personalReviewRoutes = require("./routes/personalizedReview");
const chartRoutes = require("./routes/chart");
const cognitoRoutes = require("./routes/cognito");

const app = express();

app.use(express.json());

app.set('trust proxy', 1);

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'none'
  },
  store: MongoStore.create({
    mongoUrl: MONGO_DB,
    ttl: 14 * 24 * 60 * 60,
    autoRemove: 'native'
  })
}));

logger.info("Session Middleware Initialized");

app.use("/api", searchRoutes);
app.use("/api", tldrRoutes);
app.use("/api", userRoutes);
app.use("/api", steamRoutes);
app.use("/api", xboxRoutes);
app.use("/api", personalReviewRoutes);
app.use("/api", chartRoutes);
app.use("/api", cognitoRoutes);

app.get('/test-session', (req, res) => {
    req.session.user = { id: 'test' };
    res.send('Session set');
});

mongoose.connect(MONGO_DB, {
  tls: true
}).then(() => {
  logger.info('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

app.use((req, res, next) => {
  console.log("Request Headers:", req.headers);
  console.log("Request URL:", req.url);
  console.log("req.sessionID: ", req.sessionID);
  console.log("req.session: ", req.session);
  next();
});

app.listen(PORT, () => logger.info(`HTTP server running on port ${PORT}`));
