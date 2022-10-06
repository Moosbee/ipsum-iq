//https://github.com/me-no-dev/ESPAsyncWebServer/

// Import required libraries
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>

#define DEBUG 1
//debug/debugln for debugging
#if DEBUG == 1
#define debug(x) Serial.print(x)
#define debugln(x) Serial.println(x)
#else
#define debug(x)
#define debugln(x)
#endif



#ifndef STASSID
//#define STASSID "htlwlan"
//#define STAPSK  "htl12345"
#define STASSID "Riedberrypi"
#define STAPSK  "This Password is dumm!"
#endif

// Replace with your network credentials
const char* ssid     = STASSID;
const char* password = STAPSK;

bool ledState = false;
const int ledPin = LED_BUILTIN;

// Create AsyncWebServer object on port 80
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html lang="en">
</html>
)rawliteral";



String genJsonResp(bool state){
  String jsonResp="{!status!:?}";
  jsonResp[1]=34;
  jsonResp[8]=34;
  jsonResp[10]=48+state;
  return jsonResp;
}

//void notifyClients() {
//  ws.textAll(String(ledState));
//}

void handleWebSocketMessage(void *arg, uint8_t *data, size_t len) {
  AwsFrameInfo *info = (AwsFrameInfo*)arg;
  if (info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT) {
    data[len] = 0;
    debugln((char*)data);
  }
}

void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type,
             void *arg, uint8_t *data, size_t len) {
    switch (type) {
      case WS_EVT_CONNECT:
        #if DEBUG == 1
          Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
        #endif
        break;
      case WS_EVT_DISCONNECT:
        #if DEBUG == 1
          Serial.printf("WebSocket client #%u disconnected\n", client->id());
        #endif
        break;
      case WS_EVT_DATA:
        handleWebSocketMessage(arg, data, len);
        break;
      case WS_EVT_PONG:
      case WS_EVT_ERROR:
        break;
  }
}

void initWebSocket() {
  ws.onEvent(onEvent);
  server.addHandler(&ws);
}

String processor(const String& var){
  debugln(var);
  return String();
}

void setup(){
  // Serial port for debugging purposes
  delay(1000);
  Serial.begin(115200);
  delay(1000);

  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, HIGH);
  
  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    debugln("Connecting to WiFi..");
  }

  // Print ESP Local IP Address
  debugln(WiFi.localIP());
  digitalWrite(ledPin, LOW);

  initWebSocket();

  // Route for root / web page
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send_P(200, "text/html", index_html, processor);
  });

    // Route for root / web page
  server.on("/status", HTTP_GET, [](AsyncWebServerRequest *request){
    
    
    request->send_P(200, "text/html", index_html, processor);
  });

    // Route for root / web page
  server.on("/toggle/on", HTTP_POST, [](AsyncWebServerRequest *request){
    ledState=true;
    request->send_P(200, "text/html", index_html, processor);
  });

    // Route for root / web page
  server.on("/toggle/off", HTTP_POST, [](AsyncWebServerRequest *request){
    ledState=false;
    request->send_P(200, "text/html", index_html, processor);
  });

    server.on("/toggle", HTTP_POST, [](AsyncWebServerRequest *request){
    ledState=!ledState;
    request->send_P(200, "text/html", index_html, processor);
  });

  // Start server
  server.begin();
}

void loop() {
  ws.cleanupClients();
}
