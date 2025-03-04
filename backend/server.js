const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const searchRoutes = require("./routes/search");
const tldrRoutes = require("./routes/generalreview");

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*"; 

app.use(cors({
  origin: CORS_ORIGIN,
  methods: "GET,POST",
  credentials: true
}));

app.use(express.json());

app.use("/api", searchRoutes);
app.use("/api", tldrRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS allowed origin: ${CORS_ORIGIN}`);
});

