const deviceRouter = require("./device.route");
const homeRouter = require("./home.route");
const sensorRouter = require("./sensor.route");

function routes(app) {
  const version = "/";
  app.use(version, homeRouter);
  app.use(version + "device", deviceRouter);
  app.use(version + "sensor", sensorRouter);
}

module.exports = { routes };
