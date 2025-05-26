import mqtt from 'mqtt';

class MQTTService {
  private client: mqtt.MqttClient | null = null;
  private connected = false;

  connect() {
    if (this.connected) {
      return;
    }

    this.client = mqtt.connect("ws://192.168.1.21:9001", {
      username: "hoanganh",
      password: "22122002"
    });

    this.client.on("connect", () => {
      if (!this.connected) {
        console.log("✅ MQTT connected (frontend)");
        this.connected = true;
        this.client?.subscribe("esp32/sensors");
        this.client?.subscribe("esp32/lights/log");
      }
    });
  }

  subscribeToSensorData(callback: (entry: any) => void) {
    this.client?.on("message", (topic, message) => {
      if (topic === "esp32/sensors") {
        try {
          const parsed = JSON.parse(message.toString());
          callback(parsed);
        } catch (err) {
          console.error("❌ Sensor parse failed:", err);
        }
      }
    });
  }

  subscribeToDeviceData(callback: (entry: any) => void) {
    this.client?.on("message", (topic, message) => {
      if (topic === "esp32/lights/log") {
        try {
          const parsed = JSON.parse(message.toString());
          const formatted = {
            id: Date.now(),
            name: parsed.led === 1 ? "light" : parsed.led === 2 ? "fan" : "aircon",
            status: parsed.state === "on",
            timestamp: parsed.timestamp,
          };
          callback(formatted);
        } catch (err) {
          console.error("❌ Device parse failed:", err);
        }
      }
    });
  }

  publishDeviceControl(device: string, status: boolean) {
    if (!this.client) return;

    const led = device === "light" ? 1 : device === "fan" ? 2 : 3;
    const payload = JSON.stringify({ led, state: status ? "on" : "off" });

    this.client.publish("esp32/lights/control", payload);
    console.log(`📤 MQTT published: ${payload}`);
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
    }
  }
}

export default new MQTTService();
