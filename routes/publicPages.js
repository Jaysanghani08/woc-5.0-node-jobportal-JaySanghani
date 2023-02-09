const express = require('express');
const path = require('path');
const router = express.Router();
const studentController = require('./../controllers/studentController.js');
const companyController = require('./../controllers/companyController.js');

// index path
router.get("^/$|index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
})

//about path
router.get("/about(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "about.html"));
})

router.get("/studentSignup(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "studentSignup.html"));
})

router.post('/student_submit_sign_up', studentController.handleNewStudent);      // register form data store

router.get("/studentLogin(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "studentLogin.html"));
})

router.post('/student_login', studentController.loginStudent); // login for student
      

router.get("/companySignup(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..",   "views",  "companySignup.html"));
})

router.post('/company_submit_sign_up', companyController.handleNewCompany);      // register form data store

router.get("/companyLogin(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..",  "views", "companyLogin.html"));
})

router.post('/company_login', companyController.loginCompany);      // register form data store
module.exports = router;