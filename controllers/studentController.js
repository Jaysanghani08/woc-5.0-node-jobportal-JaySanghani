const bcrypt = require("bcrypt");
const Student = require("./../model/student.js");
// const studentImage = require("./../model/studentImage");
const jwt = require('jsonwebtoken');

const handleNewStudent = async function (req, res) {
  const { fname, lname, email, password, phone, age, education, github, cpi } = req.body;

  // console.log(data);
  if (!email || !password || !fname || !lname || !phone || !age || !education || !cpi|| !github) return res.status(400).json({ 'message': 'Please fill in All details.' });

  // check for duplicate usernames in the db
  const duplicate = await Student.findOne({ email: email }).exec();
  if (duplicate) return res.sendStatus(409); //Conflict 

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);

    //create and store the new user
    var data = {
      "email": email,
      "password": hashedPwd,
      "fname": fname,
      "lname": lname,
      "phone": phone,
      "age": age,
      "education": education,
      "cpi": cpi,
      "github": github,
      // "resume": resume
    }
    const result = await Student.create(data);

    // console.log(result);
    // Create token
    // const token = jwt.sign(
    //   { email: result.email, _id: result.id },
    //   process.env.STUDENT_TOKEN_SECRET,
    //   {
    //     expiresIn: "2h",
    //   }
    // );
    // // save user token
    // result.token = token;

    // res.cookie("jwt", token, {
    //   httpOnly: true,
    //   maxAge: 86400 * 1000 // 60s
    // });

    // const userSendToHTML = result;
    // console.log(userSendToHTML);
    // delete emp['password'];

    // res.user(`${userSendToHTML}`);
    res.redirect('/studentLogin');
  } catch (err) {
    res.status(500).json({ 'message': err.message });
  }
}

const loginStudent = async function (req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json("email and password are required");

  //check if email exists or not
  const foundStudent = await Student.findOne({ email: email }).exec();
  if (!foundStudent) return res.status(401).json("Email not found. Register yourself first.");           // Unauthorised

  // check password matches or not
  const match = await bcrypt.compare(password, foundStudent.password);
  // console.log(foundStudent.password);
  if (!match) return res.status(401).json("Password is incorrect");

  try {
    // const token = jwt.sign({email: foundStudent.email, _id : foundStudent.id}, process.env.STUDENT_TOKEN_SECRET);
    const token = jwt.sign(
      { email: foundStudent.email, _id: foundStudent.id },
      process.env.STUDENT_TOKEN_SECRET,
      {
        expiresIn: "2h",
      }
    );

    foundStudent.token = token;
    // const maxAge = 80 ;
    // console.log("inside try of login");

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 86400 * 1000 // 2 days
    })
    // .cookie("student", userSendToHTML , {
    //   httpOnly: true,
    //   maxAge: 86400 * 2000 // 2 days
    // });


    // res.user(`${userSendToHTML}`);
    res.redirect('/student/findCompanies');
  } catch (err) {
    console.log("inside catch of login");
    res.status(500).json(err);
  }
}

const authVerify = async function (req, res, next) {
  const token = req.cookies.jwt;

  if (!token) return res.status(401).json("Access denied.");

  try {
    const verified = jwt.verify(token, process.env.STUDENT_TOKEN_SECRET);
    const foundStudent = await Student.findOne({ email: verified.email }).exec();
    if (!foundStudent) return res.status(401).json("Email not found. Register yourself first.");
    // console.log(foundStudent);
    foundStudent.password = "";
    // foundStudent.id = "";
    req.user = foundStudent;
    next();
  } catch (err) {
    res.status(401).redirect('/studentLogin.html');
  }
}

const updateStudent = async function (req, res) {
  // console.log(req.user)
  // if (!req?.user?._id) {
  //   return res.status(400).json({ 'message': 'Try Again' });
  // }

  if (!req?.body?.email) {
    return res.status(400).json({ 'message': 'Try Again' });
  }

  const student = await Student.findOne({ email: req.body.email}).exec();
  
  if (!student) {
    return res.status(204).json({ "message": `No student matches ID ${req.body.email}.` });
  }
  if (req.body?.fname) student.fname = req.body.fname;
  if (req.body?.lname) student.lname = req.body.lname;
  // if (req.body?.location) student.location = req.body.location;
  if (req.body?.phone) student.phone = req.body.phone;
  if (req.body?.age) student.age = req.body.age;
  if (req.body?.education && req.body.education != '0') student.education = req.body.education;
  // if (req.body?.institution) student.institution = req.body.institution;
  if (req.body?.cpi) student.cpi = req.body.cpi;
  if (req.body?.github) student.github = req.body.github;
  // if (req.body?.resume) student.resume = req.body.resume;
  // console.log(student);
  const result = await student.save();
  res.redirect('/student/studentProfile');
}

const logoutStudent = async function (req, res) {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.redirect('/index');
}

const deleteStudent = async function (req, res) {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(400).json({ 'message': 'error' });      //No content
  const token = cookies.jwt;

  const verified = jwt.verify(token, process.env.STUDENT_TOKEN_SECRET);
  const foundStudent = await Student.findOne({ email: verified.email }).exec();
  if (!foundStudent) return res.status(401).json("Email not found. Register yourself first.");

  const result = await foundStudent.deleteOne(); //{ _id: req.body.id }
  console.log(result);

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.redirect('/index');
}


module.exports = { handleNewStudent, loginStudent, authVerify, updateStudent, logoutStudent, deleteStudent }