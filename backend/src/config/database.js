const mongoose = require("mongoose");

//setting up dotenv
const dotenv = require("dotenv").config();

//fetching mongodb details
const mongoUri = process.env.MONGODB_URI;
const mongodbUser = process.env.DB_USERNAME;
const mongodbPass = process.env.DB_PASSWORD;
const mongodbName = process.env.DB_NAME;

//establish mongoDB connection
const connectToDatabase = () => {
  mongoose
    .connect(mongoUri, {
      dbName: mongodbName,
      user: mongodbUser,
      pass: mongodbPass,
    })
    .then(() => {
      console.info("Connected to database...");
    })
    .catch((err) => {
      console.error("error connecting to database", err);
    });
};

module.exports = connectToDatabase;
