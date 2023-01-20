const express = require('express');
const path = require('path');
const router = express.Router();
const { authVerify, updateStudent, logoutStudent , deleteStudent} = require('../controllers/studentController');
const {educationlvl} = require('../model/education')
const Company = require("../model/company");


router.get("/profile(.html)?", authVerify, (req, res) => {

  // console.log(req.user);
  const data = {
    email : req.user.email,
    fname : req.user.fname,
    fname : req.user.fname,
    lname : req.user.lname,
    // location : req.user.location,
    phone : req.user.phone,
    age : req.user.age,
    education : educationlvl[req.user.education],
    // institution : req.user.institution,
    cpi : req.user.cpi,
    github : req.user.github,
    // resume : req.user.resume
  };

  try {
    res.render("studentProfile", data);
  }catch(err){
    res.send(err);
  }
})

router.get("/editStudent(.html)?", authVerify, (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "..", "views", "editStudent.html"));
  }catch(err){
    res.send(err);
  }
})

router.post("/updateStudent", updateStudent);
router.get("/findCompanies(.html)?", authVerify, async function (req, res) {
  const { email, cpi, age, fname, description, package, position, website } = req.user;

  const foundCompanies = await Company.find({ $and: [{ 'cpi': { $lte: cpi } }, { 'age': { $lte: age } }] }).exec();
  // console.log(foundCompanies);

  const  obj = {foundCompanies :foundCompanies, student : fname};
  console.log(obj);

  try {
    res.render("findCompanies",obj);
  }catch(err){
    res.send(err);
  }
});

router.get('/logOutStudent', authVerify, logoutStudent);
router.get('/deleteStudent', authVerify, deleteStudent);


module.exports = router;