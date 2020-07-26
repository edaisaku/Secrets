//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');


// create app using express
const app = express();
// tell express that our static files are at public folder
app.use(express.static("public"));
// set view engine using ejs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// level 2 - encryption
//const secret = "Thisisourlittlesecret";
// userSchema.plugin(encrypt, {
//   secret: secret,
//   encryptedFields: ['password']
// });

//level - 3
userSchema.plugin(encrypt, {secret: process.env.SECRET,encryptedFields: ['password'] })

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/", function(req, res) {})

app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets")
    }
  });
})

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    email: username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets")
        } else {
          console.log("Incorrect password");
        }
      }
    }
  })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
