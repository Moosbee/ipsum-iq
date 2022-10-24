var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false});
var database = require('database');

const port = 8000;
app.use(express.json());


app.post('/login', urlencodedParser, function(req, res) {

  var postrequest = req.body;
  console.log(postrequest);
  var test = database.DB_Output();
  console.log(test);
})

app.use(express.static("../frontend"));

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});


