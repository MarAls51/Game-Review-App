const express = require("express");
const cors = require("cors");
const searchRoutes = require("./ApiSearchHandler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json());

app.use("/", searchRoutes); 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});