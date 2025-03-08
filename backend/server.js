const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

const searchRoutes = require("./routes/search");
const tldrRoutes = require("./routes/generalreview");
const userRoutes = require("./routes/user");
const steamRoutes = require("./routes/steamlogin")
const xboxRoutes = require("./routes/xboxscrape")
const personalReviewRoutes = require("./routes/personalizedReview")
const chartRoutes = require("./routes/chart")

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*"; 
const MONGO_URI = process.env.MONGO_DB;

app.use(cors({
  origin: CORS_ORIGIN,
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

app.use(express.json());

app.use("/api", searchRoutes);
app.use("/api", tldrRoutes);
app.use("/api", userRoutes);
app.use("/api", steamRoutes);
app.use("/api", xboxRoutes)
app.use("/api", personalReviewRoutes)
app.use("/api", chartRoutes)

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB!");

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  }
}

startServer();
