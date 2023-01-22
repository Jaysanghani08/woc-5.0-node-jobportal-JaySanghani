const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new mongoose.Schema({
  image: {
    data: Buffer,
    contentType: String
  },
});

// Creating a Model from that Schema
module.exports = mongoose.model("Image", imageSchema);