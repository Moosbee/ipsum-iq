var express = require("express");
var app = express();

const port = 8000;

app.use(express.json());

// app.get("/", function (req, res) {
//   res.sendFile("../frontend/index.html");
// });

app.use(express.static("../frontend"));

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
