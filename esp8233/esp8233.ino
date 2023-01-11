
// https://tttapa.github.io/ESP8266/Chap01%20-%20ESP8266.html
// https://github.com/me-no-dev/ESPAsyncWebServer/
// https://randomnerdtutorials.com/esp8266-nodemcu-websocket-server-arduino/
// https://github.com/Links2004/arduinoWebSockets
// https://forum.arduino.cc/t/read-write-esp8266-eeprom-for-saving-wifi-ssid-pw-ip-adr/443719/5
// https://pijaeducation.com/eeprom-in-arduino-and-esp/
// https://www.circuitschools.com/change-wifi-credentials-of-esp8266-without-uploading-code-again/
// https://arduino.stackexchange.com/questions/54525/connecting-an-esp8266-to-wifi-without-hardcoding-the-credentials
// https://github.com/tzapu/WiFiManager

// Import required libraries

#include <WebSocketsClient.h>
#include <EEPROM.h>

#include <WiFiManager.h> //https://github.com/tzapu/WiFiManager WiFi Configuration Magic

#define DEBUG 1
// debug/debugln for debugging
#if DEBUG == 1
#define debug(x) Serial.print(x)
#define debugln(x) Serial.println(x)
#else
#define debug(x)
#define debugln(x)
#endif

// #ifndef STASSID
// #define STASSID "htlwlan"
// #define STAPSK  "htl12345"
// #define STASSID "Lorem-IQ"
// #define STAPSK "Lorem-Tech!"
// #endif

// Replace with your network credentials
// char *ssid = STASSID;
// char *password = STAPSK;

bool ledState = false;
const int ledPin = LED_BUILTIN;

bool btnState = false;
const int btnPin = 2;

bool resetState = false;
const int resetPin = 2;
int resetTimer = 0;

unsigned long zeit2 = 0;
char jsonResp[] = "{!status!:?}";

byte serverIp[4] = { 192, 168, 2, 10 };
int serverPort = 8080;

WiFiManager wifiManager;

// Create AsyncWebServer object on port 80
ESP8266WebServer server(80);
WebSocketsClient webSocket;

const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html lang="en">
</html>
)rawliteral";

void setLED(bool newState) {
  ledState = newState;
  jsonResp[10] = 48 + ledState;
  digitalWrite(ledPin, !ledState);
  webSocket.sendTXT(jsonResp);
  debug("State: ");
  debugln(ledState);
}

void handleWebSocketMessage(uint8_t* data, size_t len) {

  data[len] = 0;
  if (strcmp((char*)data, "toggle") == 0) {
    setLED(!ledState);
  }
  else if (strcmp((char*)data, "on") == 0) {
    setLED(true);
  }
  else if (strcmp((char*)data, "off") == 0) {
    setLED(false);
  }
}

void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {

  switch (type) {
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
#if DEBUG == 1
      hexdump(payload, length);
#endif
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

void handleStatus() {
  server.send(200, "text/plain", jsonResp);
}
void handleToggle() {
  setLED(!ledState);
  server.send(200, "text/plain", jsonResp);
}
void handleToggleOn() {
  setLED(true);
  server.send(200, "text/plain", jsonResp);
}
void handleToggleOff() {
  setLED(false);
  server.send(200, "text/plain", jsonResp);
}

// AdvancedWebServer.ino
void handleNotFound() {
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";

  for (uint8_t i = 0; i < server.args(); i++) {
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }

  server.send(404, "text/plain", message);
}


void resetESP() {

  // reset settings - wipe stored credentials for testing
  // these are stored by the esp library
  wifiManager.resetSettings();
}

void setup() {
  // Serial port for debugging purposes
  delay(1000);
  Serial.begin(115200);
  delay(1000);

  // WiFi.mode(WIFI_STA); // explicitly set mode, esp defaults to STA+AP
  // it is a good practice to make sure your code sets wifi mode how you want it.

  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW); // Turn the LED on (Note that LOW is the voltage level
  // but actually the LED is on; this is because
  // it is active low on the ESP-01)
  jsonResp[1] = 34;
  jsonResp[8] = 34;
  jsonResp[10] = 48 + ledState;

  debugln("Starting...");

  // Connect to Wi-Fi
  wifiManager.autoConnect("IPSUMIQ", "IQ-ESP8233");

  // Print ESP Local IP Address
  // debugln(WiFi.localIP());
  digitalWrite(ledPin, HIGH);
  delay(1000);
  digitalWrite(ledPin, ledState);

  // Route for root / web page
  // server.on("/",handleRoot); //Not needed

  server.on("/status", handleStatus);

  server.on("/toggle/on", handleToggleOn);

  server.on("/toggle/off", handleToggleOff);

  server.on("/toggle", handleToggle);

  server.onNotFound(handleNotFound);

  // server address, port and URL
  webSocket.begin(serverIp, serverPort, "/");

  // event handler
  webSocket.onEvent(webSocketEvent);

  // try ever 5000 again if connection has failed
  webSocket.setReconnectInterval(5000);

  // Start server
  server.begin();
}

void loop() {
  webSocket.loop();
  server.handleClient();
  unsigned long zeit1 = millis();
  if (zeit2 <= zeit1) {
    zeit2 = zeit1 + 5000;
    webSocket.sendTXT(jsonResp);
  }
}
