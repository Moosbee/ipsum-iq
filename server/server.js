var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false});
var database = require("./database");
const db_output = database.output;
const port = 8000;



console.log(db_output);

app.use(express.json());


//Abfangen der POST Anfrage
app.post('/login', urlencodedParser, function(req, res) {

  var postrequest = req.body;
  console.log(postrequest);
})

app.use(express.static("../frontend"));

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});



