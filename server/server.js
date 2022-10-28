var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false});
var database = require("./database");
const port = 8000;


const admin_username = database.admin_user;
const admin_password = database.admin_pwd;
const username = database.user;
const password = database.pwd;


console.log(admin_username);
console.log(admin_password);


app.use(express.json());


//Abfangen der POST Anfrage
app.post('/login', urlencodedParser, function(req, res) {

  var user_post = req.body.username;
  var pwd_post = req.body.password;
  console.log("DAS IST DER USERNAME WELCHER EINGEGEBEN WURDE: " +user_post);
  console.log("DAS IST DAS PASSWORT WELCHES EINGEGEBEN WURDE: " + pwd_post);
})

app.use(express.static("../frontend"));

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});



