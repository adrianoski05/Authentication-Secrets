//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended:true
}));


// Set mongoose
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {  useNewUrlParser: true});
console.log("App connected to MongoDB");


// Create object Schema according to mongoose-encryption
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


// Add plugins here
const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"] });


const User = new mongoose.model("User", userSchema);


app.get("/", function(req,res){
  res.render("home");
});
app.get("/login", function(req,res){
  res.render("login");
});
app.get("/register", function(req,res){
  res.render("register");
});


app.post("/register", function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  try {
    newUser.save();
    res.render("secrets");
  } catch (e) {
    console.log(e);
  }
});


app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;
  try {
    User.findOne({email: username}).then(function(foundUser){
      if(foundUser.password === password){
        res.render("secrets");
      }else{
        console.log("user or password is/are incorrect");
      }
    })
  } catch (e) {
    console.log(e);
  }
});


app.listen(3000, function(){
  console.log("Server started on port 3000.");
})
