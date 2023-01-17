const WebSocketClient = require("websocket").client;

var client = new WebSocketClient();

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

client.on("connectFailed", function (error) {
  console.log("Connect Error: " + error.toString());
});

client.on("connect", function (connection) {
  console.log("Connection established!");

  connection.on("error", function (error) {
    console.log("Connection error: " + error.toString());
  });

  connection.on("close", function () {
    console.log("Connection closed!");
  });

  connection.on("message", function (message) {
    if(message.utf8Data == "toggle") {
      console.log("DEINE MUTTER GETOGGELT");
    }
  });
  readline.question(`Send something:`, (name) => {
    
    connection.sendUTF(name);
    readline.close();
  });
});

client.connect("ws://localhost:8080/");
