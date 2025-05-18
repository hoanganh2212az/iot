const mqtt = require('mqtt');
const { database } = require('./database');

class MQTTService {
  constructor() {
    this.client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");
    this.listenersInitialized = false;
    this.setupListeners();
  }

  setupListeners() {
    if (this.listenersInitialized) return;
    this.listenersInitialized = true;

    this.client.on("connect", () => {
      console.log("✅ Connected to MQTT broker");
      this.client.subscribe("esp32/lights/log");
      this.client.subscribe("esp32/sensors");
    });

    this.client.on("message", async (topic, message) => {
      try {
        const data = JSON.parse(message.toString());

        if (topic === "esp32/lights/log") {
          const deviceName = this.getDeviceName(data.led);
          const state = data.state === "on" ? "on" : "off";

          let timestamp = data.timestamp;
          if (!timestamp || isNaN(Date.parse(timestamp))) {
            const now = new Date();
            const pad = (n) => String(n).padStart(2, '0');
            timestamp = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
          }

          const deviceKey = this.getDeviceKey(deviceName);

          await database.execute(
            'INSERT INTO devices (device_name, state, timestamp) VALUES (?, ?, ?)',
            [deviceKey, state, timestamp]
          );

          console.log(`💡 Device logged: ${deviceKey} = ${state} @ ${timestamp}`);
        }

        if (topic === "esp32/sensors") {
          const { temp, hum, light, timestamp } = data;
          const ts = timestamp || (() => {
            const now = new Date();
            const pad = (n) => String(n).padStart(2, '0');
            return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
          })();

          await database.execute(
            'INSERT INTO sensors (temp, hum, light, timestamp) VALUES (?, ?, ?, ?)',
            [temp, hum, light, ts]
          );

          console.log(`🌡 Sensor logged: T=${temp} H=${hum} L=${light} @ ${ts}`);
        }
      } catch (err) {
        console.error("❌ Lỗi xử lý MQTT message:", err.message);
      }
    });
  }

  getDeviceName(ledNumber) {
    switch (ledNumber) {
      case 1: return "Đèn";
      case 2: return "Quạt";
      case 3: return "Điều hòa";
      default: return "Unknown";
    }
  }

  getDeviceKey(deviceName) {
    switch (deviceName) {
      case "Đèn": return "light";
      case "Quạt": return "fan";
      case "Điều hòa": return "aircon";
      default: return "unknown";
    }
  }

  publishDeviceControl(device, state) {
    const ledNumber = this.getLedNumber(device);
    if (ledNumber) {
      const payload = JSON.stringify({
        led: ledNumber,
        state: state ? "on" : "off"
      });
      this.client.publish("esp32/lights/control", payload);
      console.log(`📤 Control sent to ${device}: ${payload}`);
    }
  }

  getLedNumber(device) {
    switch (device) {
      case "light": return 1;
      case "fan": return 2;
      case "aircon": return 3;
      default: return null;
    }
  }

  disconnect() {
    if (this.client?.connected) {
      this.client.end();
    }
  }
}

// Singleton instance
const mqttInstance = new MQTTService();

module.exports = {
  mqttHandler: mqttInstance,
  MqttTopicEnum: {
    DeviceToggle: "esp32/lights/control"
  }
};
