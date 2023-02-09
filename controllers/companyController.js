const bcrypt = require("bcrypt");
const Company = require("./../model/company");
const jwt = require('jsonwebtoken');

const handleNewCompany = async function (req, res) {
  const { name, email, password, age, cpi, website, position, package, description } = req.body;

  // console.log(req.body);

  if (!name || !email || !password || !age || !cpi || !website || !position || !package || !description) return res.status(400).json({ 'message': 'Please fill in All details.' });

  // check for duplicate usernames in the db
  const duplicate = await Company.findOne({ email: email }).exec();
  if (duplicate) return res.sendStatus(409); //Conflict 

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);

    //create and store the new user
    var data = {
      "name": name,
      "email": email,
      "password": hashedPwd,
      "age": age,
      "cpi": cpi,
      "website": website,
      "position": position,
      "package": package,
      "description": description,
    }
    const result = await Company.create(data);

    res.redirect('/companyLogin');
  } catch (err) {
    res.status(500).json({ 'message': err.message });
  }
}

const loginCompany = async function (req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json("email and password are required");

  //check if email exists or not
  const foundCompany = await Company.findOne({ email: email }).exec();
  if (!foundCompany) return res.status(401).json("Email not found. Register your company first.");           // Unauthorised

  // check password matches or not
  const match = await bcrypt.compare(password, foundCompany.password);
  // console.log(foundCompany.password);
  if (!match) return res.status(401).json("Password is incorrect");

  try {
    // const token = jwt.sign({email: foundCompany.email, _id : foundCompany.id}, process.env.STUDENT_TOKEN_SECRET);
    const token = jwt.sign(
      { email: foundCompany.email, _id: foundCompany.id },
      process.env.COMPANY_TOKEN_SECRET,
      {
        expiresIn: "2h",
      }
    );

    foundCompany.token = token;
    // const maxAge = 80 ;
    // console.log("inside try of login");

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 86400 * 1000 // 2 days
    })

    // res.user(`${userSendToHTML}`);
    res.redirect('/company/profile');
  } catch (err) {
    // console.log("inside catch of login");
    res.status(500).json(err);
  }
}

const authVerify = async function (req, res, next) {
  const token = req.cookies.jwt;

  if (!token) return res.status(401).json("Access denied.");

  try {
    const verified = jwt.verify(token, process.env.COMPANY_TOKEN_SECRET);

    // console.log(verified);
    const foundCompany = await Company.findOne({ email: verified.email }).exec();
    // console.log(foundCompany);
    if (!foundCompany) return res.status(401).json("Email not found. Register yourself first.");
    foundCompany.password = "";
    foundCompany.id = "";
    req.user = foundCompany;
    next();
  } catch (err) {
    res.status(401).redirect('/companyLogin.html');
  }
}

const updateCompany = async function (req, res) {
  if (!req?.body?.email) {
    return res.status(400).json({ 'message': 'Try Again' });
  }

  const company = await Company.findOne({ email: req.body.email }).exec();
  // console.log(req.body);
  if (!company) {
    return res.status(204).json({ "message": `No company matches ID ${req.body.email}.` });
  }
  if (req.body?.name) company.name = req.body.name;
  if (req.body?.email) company.email = req.body.email;
  if (req.body?.age) company.age = req.body.age;
  if (req.body?.cpi) company.cpi = req.body.cpi;
  if (req.body?.website) company.website = req.body.website;
  if (req.body?.position) company.position = req.body.position;
  if (req.body?.package) company.package = req.body.package;
  if (req.body?.description) company.description = req.body.description;
  const result = await company.save();
  res.redirect('/company/profile');
}

const logoutCompany = async function (req, res) {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.redirect('/index');
}

const deleteCompany = async function (req, res) {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(400).json({ 'message': 'error' });      //No content
  const token = cookies.jwt;

  const verified = jwt.verify(token, process.env.COMPANY_TOKEN_SECRET);
  const foundCompany = await Company.findOne({ email: verified.email }).exec();
  if (!foundCompany) return res.status(401).json("Email not found. Register yourself first.");

  const result = await foundCompany.deleteOne(); //{ _id: req.body.id }
  console.log(result);

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.redirect('/index');
}


module.exports = { handleNewCompany, loginCompany, authVerify, updateCompany, logoutCompany, deleteCompany }