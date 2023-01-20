const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  cpi: {
    type: Number,
    required: true
  },
  website: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  package: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  token: String
});

module.exports = mongoose.model('Company', companySchema);