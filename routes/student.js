const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
// const Student = require("../model/student");
const { authVerify, updateStudent, logoutStudent, deleteStudent } = require('./../controllers/studentController');
const { educationlvl } = require('./../model/education')
const ImageModel = require('./../model/studentImage')
const Company = require("./../model/company");
var multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${req.user.__id}"_"${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

const upload = multer({ storage: storage });

router.get("/studentProfile(.ejs)?", authVerify, (req, res) => {

  // console.log(req.user);
  const data = {
    email: req.user.email,
    fname: req.user.fname,
    fname: req.user.fname,
    lname: req.user.lname,
    // location : req.user.location,
    phone: req.user.phone,
    age: req.user.age,
    education: educationlvl[req.user.education],
    // institution : req.user.institution,
    cpi: req.user.cpi,
    github: req.user.github,
    // resume : req.user.resume
  };

  try {
    res.render("studentProfile", data);
  } catch (err) {
    res.send(err);
  }
})

router.get("/editStudent(.html)?", authVerify, (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "..", "views", "editStudent.html"));
  } catch (err) {
    res.send(err);
  }
})

router.get("/studentPhoto(.html)?", authVerify, (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "..", "views", "studentPhoto.html"));
  } catch (err) {
    res.send(err);
  }
})

// router.post("/postPhoto", upload.single("myImage"), async (req, res) => {
//   const obj = {
//     img: {
//       data: fs.readFileSync(path.join(__dirname , ".." , "uploads" ,"student" , req.file.filename)),
//       contentType: "image/png"
//     }
//   }

//   const newImage = new ImageModel({
//     image: obj.img
//   });

//   newImage.save((err) => {
//     err ? console.log(err) : res.redirect("/");
//   });
// });

router.post("/updateStudent", authVerify ,updateStudent);

router.get("/findCompanies(.ejs)?", authVerify, async function (req, res) {
  const { email, cpi, age, fname, description, package, position, website } = req.user;

  const foundCompanies = await Company.find({ $and: [{ 'cpi': { $lte: cpi } }, { 'age': { $lte: age } }] }).exec();
  // console.log(foundCompanies);

  const obj = { foundCompanies: foundCompanies, student: fname };
  // console.log(obj);

  try {
    res.render("findCompanies", obj);
  } catch (err) {
    res.send(err);
  }
});

router.get('/logOutStudent', authVerify, logoutStudent);
router.get('/deleteStudent', authVerify, deleteStudent);


module.exports = router;