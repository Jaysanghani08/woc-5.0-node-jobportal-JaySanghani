const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  email: {
      type: String,
      required: true
  },
  password: {
      type: String,
      required: true
  },
  fname: {
      type: String,
      required: true
  },
  lname: {
      type: String,
      required: true
  },
  // location: {
  //     type: String,
  //     required: true
  // },
  phone: {
      type: String,
      required: true
  },
  age:{
    type: Number,
    required: true
  },
  education: {
      type: Number,
      required: true
  },
  // institution: {
  //     type: String,
  //     required: true
  // },
  cpi: {
    type: Number,
    required: true
  },
  github: {
      type: String,
      required: true
  },
  // resume: {
  //     type: String,
  //     required: true
  // },
  token: String
});

module.exports = mongoose.model('Student', studentSchema);