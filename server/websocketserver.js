var WebSocketServer = require("websocket").server;
var http = require("http");

var server = http.createServer(function (request, response) {
  console.log("Received request for " + request.url);
  response.writeHead(404);
  response.end();
});
server.listen(8080, function () {
  console.log("Server is listening on port 8080");
});

wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});


wsServer.on("request", function (request) {
  var connection = request.accept();
  console.log("Connection accepted.");

  connection.on("message", function (message) {
    if (message.type === "utf8") {
      console.log("Received Message: " + message.utf8Data);

      if(message.utf8Data == "0") {
        
      }
      else if (message.utf8Data == "1") {
        
      }
      
    } else if (message.type === "binary") {
      console.log(
        "Received Binary Message of " + message.binaryData.length + " bytes"
      );
      // connection.sendBytes(message.binaryData);
    }
  });
  connection.on("close", function (reasonCode, description) {
    console.log("Peer " + connection.remoteAddress + " disconnected.");
  });
});
