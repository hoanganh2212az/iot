#include <WiFi.h>
#include <PubSubClient.h>
#include "time.h"
#include <DHT.h>

// ------------ Configuration ------------

const char* ssid = "Hehe";
const char* password = "123456789";
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;

// NTP Time
const char* ntpServer = "pool.ntp.org";
const char* ntpFallback = "129.6.15.28";
const long gmtOffset_sec = 7 * 3600;
const int daylightOffset_sec = 0;

// Sensor Pins
#define DHTPIN 4
#define DHTTYPE DHT11
#define LIGHT_ANALOG 32

// Light Control Pins
#define LED1 18
#define LED2 19
#define LED3 21
bool ledStates[4] = {false, false, false, false};  // 1-based indexing

// Alert LED Pins
#define ALERT_TEMP 25
#define ALERT_HUM 26
#define ALERT_LIGHT 27

unsigned long lastBlinkTime = 0;
const unsigned long blinkInterval = 500;
bool alertStates[3] = {false, false, false};
bool blinkStates[3] = {false, false, false};

// Objects
WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);

unsigned long lastSensorPublish = 0;
const unsigned long sensorInterval = 2000;

// ------------ Utility Functions ------------

String getFormattedTime() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) return "00:00:00 00/00/0000";
  char timeStr[30];
  strftime(timeStr, sizeof(timeStr), "%H:%M:%S %d/%m/%Y", &timeinfo);
  return String(timeStr);
}

void setup_wifi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries++ < 20) {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected! IP: " + WiFi.localIP().toString());
  } else {
    Serial.println("\nWiFi connection failed.");
  }
}

void sync_time() {
  struct tm timeinfo;
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  int retry = 0;

  while (!getLocalTime(&timeinfo) && retry++ < 15) {
    Serial.print(".");
    delay(200);
  }

  if (!getLocalTime(&timeinfo)) {
    Serial.println("\nTrying fallback NTP...");
    configTime(gmtOffset_sec, daylightOffset_sec, ntpFallback);
    retry = 0;
    while (!getLocalTime(&timeinfo) && retry++ < 10) {
      Serial.print(".");
      delay(200);
    }
  }

  if (getLocalTime(&timeinfo)) {
    Serial.println("\nTime synced: " + getFormattedTime());
  } else {
    Serial.println("\nNTP sync failed.");
  }
}

// ------------ MQTT Reconnect ------------

bool hasSentInitialLog = false;

bool reconnect() {
  String clientId = "ESP32Client_" + String(random(0xffff), HEX);
  Serial.print("Connecting to MQTT as ");
  Serial.println(clientId);

  if (client.connect(clientId.c_str())) {
    Serial.println("MQTT connected.");
    client.subscribe("esp32/lights/control");
    client.publish("esp32/status", "ESP32 online");

    if (!hasSentInitialLog) {
      hasSentInitialLog = true;
      for (int i = 1; i <= 3; i++) {
        String state = ledStates[i] ? "on" : "off";
        String payload = "{\"led\":" + String(i) +
                         ",\"state\":\"" + state +
                         "\",\"timestamp\":\"" + getFormattedTime() + "\"}";
        client.publish("esp32/lights/log", payload.c_str());
        Serial.println("Published initial LED state: " + payload);
      }
    }

    return true;
  } else {
    Serial.print("Failed, rc=");
    Serial.print(client.state());
    Serial.println(". Retrying...");
    return false;
  }
}

// ------------ MQTT Callback ------------

void callback(char* topic, byte* message, unsigned int length) {
  String msg;
  for (int i = 0; i < length; i++) msg += (char)message[i];
  Serial.println("MQTT Received: " + msg);

  int ledNum = msg.indexOf("\"led\":") != -1 ? msg.substring(msg.indexOf("\"led\":") + 6).toInt() : 0;
  String state = msg.indexOf("on") != -1 ? "on" : "off";
  bool turnOn = (state == "on");

  if (ledNum >= 1 && ledNum <= 3) {
    if (ledStates[ledNum] == turnOn) {
      Serial.println("🔁 Ignored redundant toggle for LED " + String(ledNum));
      return;
    }

    int pin = (ledNum == 1) ? LED1 : (ledNum == 2) ? LED2 : LED3;
    digitalWrite(pin, turnOn ? HIGH : LOW);
    ledStates[ledNum] = turnOn;

    String logPayload = "{\"led\":" + String(ledNum) +
                        ",\"state\":\"" + state +
                        "\",\"timestamp\":\"" + getFormattedTime() + "\"}";
    client.publish("esp32/lights/log", logPayload.c_str());
    Serial.println("Published light event: " + logPayload);
  }
}

// ------------ Setup ------------

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\nESP32 Booting...");

  pinMode(LED1, OUTPUT); pinMode(LED2, OUTPUT); pinMode(LED3, OUTPUT);
  digitalWrite(LED1, LOW); digitalWrite(LED2, LOW); digitalWrite(LED3, LOW);

  pinMode(ALERT_TEMP, OUTPUT);
  pinMode(ALERT_HUM, OUTPUT);
  pinMode(ALERT_LIGHT, OUTPUT);

  digitalWrite(ALERT_TEMP, LOW);
  digitalWrite(ALERT_HUM, LOW);
  digitalWrite(ALERT_LIGHT, LOW);

  setup_wifi();
  sync_time();

  dht.begin();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

// ------------ Main Loop ------------

void loop() {
  if (!client.connected()) {
    if (!reconnect()) {
      delay(2000);
      return;
    }
  }

  client.loop();

  unsigned long now = millis();
  if (now - lastSensorPublish > sensorInterval) {
    lastSensorPublish = now;

    float temp = dht.readTemperature();
    float hum = dht.readHumidity();
    int rawLight = analogRead(LIGHT_ANALOG);
    int light = map(rawLight, 4095, 0, 0, 1000);
    light = constrain(light, 0, 1000);

    String timestamp = getFormattedTime();

    if (!isnan(temp) && !isnan(hum)) {
      String payload = "{\"temp\":" + String(temp, 1) +
                       ",\"hum\":" + String(hum, 1) +
                       ",\"light\":" + String(light) +
                       ",\"timestamp\":\"" + timestamp + "\"}";
      client.publish("esp32/sensors", payload.c_str());
      Serial.println("Published sensor data: " + payload);

      alertStates[0] = temp > 40;
      alertStates[1] = hum > 75;
      alertStates[2] = light > 800;
    } else {
      Serial.println("DHT sensor read failed.");
    }
  }

  if (now - lastBlinkTime >= blinkInterval) {
    lastBlinkTime = now;
    for (int i = 0; i < 3; i++) {
      if (alertStates[i]) {
        blinkStates[i] = !blinkStates[i];
        digitalWrite(ALERT_TEMP + i, blinkStates[i]);
      } else {
        blinkStates[i] = false;
        digitalWrite(ALERT_TEMP + i, LOW);
      }
    }
  }
}
