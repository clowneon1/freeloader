const mongoose = require("mongoose");

const fileProperitesSchema = new mongoose.Schema({
  id: String,
  name: String,
  size: String,
  date: {
    type: Date,
  },
  fileUrls: [String],
});

const FileProperties = mongoose.model("FileProperties", fileProperitesSchema);

module.exports = FileProperties;
