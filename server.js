require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const ejs = require('ejs');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

const studentController = require('./controllers/studentController');

// connect to DataBase
connectDB();

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MiddleWares

// log every request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} `);
  next();
})

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, "public")));
app.use('/student', express.static(path.join(__dirname, "public")));
app.use('/company', express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({
  extended: true
}));

// public pages pages path
app.use('/', require('./routes/publicPages'));

// restricted pages
app.use('/student', require('./routes/student.js'));
app.use('/company', require('./routes/company.js'));


mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`server started listening on port ${PORT}`));
});

