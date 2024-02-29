const mongoose = require("mongoose");

const secretSchema = new mongoose.Schema({
  id: String,
  secretKey: String,
});

const Secret = mongoose.model("admin", secretSchema);

module.exports = Secret;
