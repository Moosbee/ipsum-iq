
// https://tttapa.github.io/ESP8266/Chap01%20-%20ESP8266.html
// https://elektro.turanis.de/html/prj299/index.html
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
const int ledPin = 0;

bool btnState = false;
const int btnPin = 3;

const int resetPin = 2;
unsigned long zeitResetPin = 0;

unsigned long zeit2 = 0;
char jsonResp[] = "{!status!:?}";

char websocket_server[40] = "";
char websocket_port[6] = "";
char websocket_path[40] = "/";

bool shouldSaveConfig = false;

WiFiManager wifiManager;

// Create AsyncWebServer object on port 80
ESP8266WebServer server(80);
WebSocketsClient webSocket;

void setLED(bool newState) {
  ledState = newState;
  jsonResp[10] = 48 + ledState;
  digitalWrite(ledPin, ledState);
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

// callback notifying us of the need to save config
void saveConfigCallback() {
  debugln("Should save config");
  shouldSaveConfig = true;
}

void rebootESP() {
  debugln("Rebooting");
  ESP.restart();
}

void resetESP() {

  debugln("Resetting");
  webSocket.sendTXT("Resetting");
  // reset settings - wipe stored credentials for testing
  // these are stored by the esp library
  wifiManager.resetSettings();

  ESP.restart();
}

const int offset = 20;

void loadConfigFromEEPROM() {
  EEPROM.begin(128);
  debugln("Start load from EEPROM");
  for (int i = 0; i < 40; i++) {
    byte readByte = EEPROM.read(i + offset);
    debugln(readByte);
    websocket_server[i] = readByte;
  }

  for (int i = 0; i < 6; i++) {
    byte readByte = EEPROM.read(i + 50 + offset);
    debugln(readByte);
    websocket_port[i] = readByte;
  }

  for (int i = 0; i < 40; i++) {
    byte readByte = EEPROM.read(i + 60 + offset);
    debugln(readByte);
    websocket_path[i] = readByte;
  }
  EEPROM.end();
  debugln("The values in the file are: ");
  debugln(websocket_server);
  debugln(websocket_port);
  debugln("Finish load from EEPROM");
}

void saveConfigToEEPROM() {
  EEPROM.begin(128);
  debugln("Start saving from EEPROM");
  for (int i = 0; i < 40; i++) {
    byte writeByte = websocket_server[i];
    debugln(writeByte);
    EEPROM.write(i + offset, writeByte);
  }

  for (int i = 0; i < 6; i++) {
    byte writeByte = websocket_port[i];
    debugln(writeByte);
    EEPROM.write(i + 50 + offset, writeByte);
  }

  for (int i = 0; i < 40; i++) {
    byte writeByte = websocket_path[i];
    debugln(writeByte);
    EEPROM.write(i + 60 + offset, writeByte);
  }
  EEPROM.end();
  debugln("Finish saving from EEPROM");
}

void setup() {
  // Serial port for debugging purposes only
#if DEBUG == 1
  delay(1000);
  Serial.begin(115200);
#endif
  delay(1000);

  // WiFi.mode(WIFI_STA); // explicitly set mode, esp defaults to STA+AP
  // it is a good practice to make sure your code sets wifi mode how you want it.

  delay(500);

  pinMode(btnPin, INPUT_PULLUP);
  pinMode(resetPin, INPUT_PULLUP);

  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW); // Turn the LED on (Note that LOW is the voltage level
  // but actually the LED is on; this is because
  // it is active low on the ESP-01)
  jsonResp[1] = 34;
  jsonResp[8] = 34;
  jsonResp[10] = 48 + ledState;

  debugln("Starting...");

  loadConfigFromEEPROM();

  wifiManager.setConfigPortalTimeout(180);

  // id/name, placeholder/prompt, default, length
  WiFiManagerParameter custom_websocket_server("server", "websocket server", websocket_server, 40);

  // id/name, placeholder/prompt, default, length
  WiFiManagerParameter custom_websocket_port("port", "websocket port", websocket_port, 6);

  // id/name, placeholder/prompt, default, length
  WiFiManagerParameter custom_websocket_path("path", "Name of the ESP(has to start with '/')", websocket_path, 40);

  wifiManager.addParameter(&custom_websocket_server);
  wifiManager.addParameter(&custom_websocket_port);
  wifiManager.addParameter(&custom_websocket_path);

  wifiManager.setSaveConfigCallback(saveConfigCallback);

  wifiManager.setCustomHeadElement("<style>html{color:blue;}</style>");

  // Connect to Wi-Fi
  wifiManager.autoConnect("IPSUM|IQ", "IQ-ESP8233");

  // Print ESP Local IP Address
  debugln(WiFi.localIP());
  digitalWrite(ledPin, HIGH);
  delay(1000);
  digitalWrite(ledPin, ledState);

  if (shouldSaveConfig) {
    strcpy(websocket_server, custom_websocket_server.getValue());
    strcpy(websocket_port, custom_websocket_port.getValue());
    strcpy(websocket_path, custom_websocket_path.getValue());
    saveConfigToEEPROM();
  }

  debugln("The values in the file are: ");
  debugln(websocket_server);
  debugln(websocket_port);
  debugln(websocket_path);

  // Route for root / web page
  // server.on("/",handleRoot); //Not needed

  server.on("/status", handleStatus);

  server.on("/toggle/on", handleToggleOn);

  server.on("/toggle/off", handleToggleOff);

  server.on("/toggle", handleToggle);

  server.on("/reset", resetESP);

  server.on("/reboot", rebootESP);

  server.onNotFound(handleNotFound);

  // server address, port and URL
  webSocket.begin(websocket_server, atoi(websocket_port), websocket_path);

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
  if (digitalRead(resetPin)) {
    zeitResetPin = zeit1;
  }
  if ((zeit1 - 5000) > zeitResetPin) {
    resetESP();
  }
  if (btnState && btnState != digitalRead(btnPin)) {
    // code here gets executed on raising edge of btn
    setLED(!ledState);
  }
  btnState = digitalRead(btnPin);
  delay(10);
}
