var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false});
const database = require("./database");
const { json } = require("body-parser");
const port = 8000;

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



