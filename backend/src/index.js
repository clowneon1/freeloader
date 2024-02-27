// generate express api which exposes an endpoint for upload which takes a file and uploads it to discord via bot
require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");

const driveRouter = require("./drive/drive-routes.js");

app.use(express.json()); // Middleware for parsing JSON
app.use(cors());
app.use("/", driveRouter);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
