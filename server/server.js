var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false});

const port = 8000;

app.use(express.json());

app.post('/login', urlencodedParser, function(req, res) {
  console.log(req.body);
  
})

app.use(express.static("../frontend"));

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
