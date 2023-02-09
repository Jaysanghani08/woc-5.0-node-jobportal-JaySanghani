const express = require('express');
const path = require('path');
const router = express.Router();
const { authVerify, updateCompany, logoutCompany , deleteCompany} = require('./../controllers/companyController');
// const {educationlvl} = require('../model/education')


router.get("/profile(.html)?", authVerify, (req, res) => {

  // console.log(req.user);
  const data = {
    name: req.user.name,
    email : req.user.email,
    age : req.user.age,
    cpi : req.user.cpi,
    website : req.user.website,
    position : req.user.position,
    package : req.user.package,
    description : req.user.description,
  };

  try {
    res.render("companyProfile", data);
  }catch(err){
    res.send(err);
  }
})

router.get("/editCompany(.html)?", authVerify, (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "..", "views", "editCompany.html"));
  }catch(err){
    res.send(err);
  }
})

router.post("/updateCompany",authVerify, updateCompany);

router.get('/logOutCompany', authVerify, logoutCompany);
router.get('/deleteCompany', authVerify, deleteCompany);

module.exports = router;