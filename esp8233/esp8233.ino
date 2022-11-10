

// https://github.com/me-no-dev/ESPAsyncWebServer/
// https://randomnerdtutorials.com/esp8266-nodemcu-websocket-server-arduino/
// https://github.com/Links2004/arduinoWebSockets

// Import required libraries

#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>

#include <WebSocketsClient.h>

#define DEBUG 1
// debug/debugln for debugging
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
#define STASSID "Lorem-IQ"
#define STAPSK "Lorem-Tech!"
#endif

// Replace with your network credentials
const char *ssid = STASSID;
const char *password = STAPSK;

bool ledState = false;
const int ledPin = LED_BUILTIN;
unsigned long zeit2 = 0;
char jsonResp[] = "{!status!:?}";

// Create AsyncWebServer object on port 80
AsyncWebServer server(80);
WebSocketsClient webSocket;

const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html lang="en">
</html>
)rawliteral";

String processor(const String &var)
{
  debugln(var);
  return String();
}

void setLED(bool newState)
{
  ledState = newState;
  jsonResp[10] = 48 + ledState;
  digitalWrite(ledPin, !ledState);
  debug("State: ");
  debugln(ledState);
}

void handleWebSocketMessage(uint8_t *data, size_t len)
{

  data[len] = 0;
  if (strcmp((char *)data, "toggle") == 0)
  {
    setLED(!ledState);
  }else if (strcmp((char *)data, "on") == 0)
  {
    setLED(true);
  }else if (strcmp((char *)data, "off") == 0)
  {
    setLED(false);
  }
}

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length)
{

  switch (type)
  {
  case WStype_DISCONNECTED:
    debugln("[WSc] Disconnected!");
    break;
  case WStype_CONNECTED:
  {
    debugln("[WSc] Connected");

    // send message to server when Connected
    webSocket.sendTXT("Connected");
  }
  break;
  case WStype_TEXT:
#if DEBUG == 1
    Serial.printf("[WSc] get text: %s\n", payload);
#endif
    handleWebSocketMessage(payload, length);
    // send message to server
    // webSocket.sendTXT("message here");
    break;
  case WStype_BIN:
    debug("[WSc] get binary length:");
    debugln(length);
    hexdump(payload, length);

    // send data to server
    // webSocket.sendBIN(payload, length);
    break;
  case WStype_PING:
    // pong will be send automatically
    debugln("[WSc] get ping");
    break;
  case WStype_PONG:
    // answer to a ping we send
    debugln("[WSc] get pong");
    break;
  }
}

void setup()
{
  // Serial port for debugging purposes
  delay(1000);
  Serial.begin(115200);
  delay(1000);

  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW); // Turn the LED on (Note that LOW is the voltage level
  // but actually the LED is on; this is because
  // it is active low on the ESP-01)
  jsonResp[1] = 34;
  jsonResp[8] = 34;
  jsonResp[10] = 48 + ledState;
  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    debugln("Connecting to WiFi...");
  }

  // Print ESP Local IP Address
  debugln(WiFi.localIP());
  digitalWrite(ledPin, HIGH);
  delay(1000);
  digitalWrite(ledPin, ledState);

  // Route for root / web page
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
            {
    debugln("Root");
    request->send_P(200, "text/html", index_html, processor); });

  server.on("/status", HTTP_GET, [](AsyncWebServerRequest *request)
            {
    debugln("Status");
    
    request->send_P(200, "text/html", jsonResp, processor); });

  server.on("/toggle/on", HTTP_POST, [](AsyncWebServerRequest *request)
            {
    setLED(true);
    debugln("toggle on");
    
    request->send_P(200, "text/html", jsonResp, processor); });

  server.on("/toggle/off", HTTP_POST, [](AsyncWebServerRequest *request)
            {
    setLED(false);
    debugln("toggle off");
    request->send_P(200, "text/html", jsonResp, processor); });

  server.on("/toggle", HTTP_POST, [](AsyncWebServerRequest *request)
            {
    setLED(!ledState);
    debugln("toggle");
    request->send_P(200, "text/html", jsonResp, processor); });

  // server address, port and URL
  webSocket.begin("192.168.2.10", 8080, "/");

  // event handler
  webSocket.onEvent(webSocketEvent);

  // try ever 5000 again if connection has failed
  webSocket.setReconnectInterval(5000);

  // Start server
  server.begin();
}

void loop()
{
  webSocket.loop();
  unsigned long zeit1 = millis();
  if (zeit2 <= zeit1)
  {
    zeit2 = zeit1 + 1000;
    webSocket.sendTXT(jsonResp);
  }
}
