const { mqttHandler, MqttTopicEnum } = require('../config/mqtt');
const { ErrorConstants } = require('../constants/error.constant');
const { deviceModel } = require('../models/device.model');
const { database } = require('../config/database');

const deviceService = {
  getOne: async (id) => {
    return deviceModel.getOne(id);
  },

  getAll: async (pageSize, page, dateSearch, sortBy, sortOrder) => {
    const conditions = [];
    const params = [];

    if (dateSearch) {
      conditions.push("timestamp LIKE ?");
      params.push(`%${dateSearch}%`);
    }

    let query = 'SELECT * FROM devices';
    if (conditions.length) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const countQuery = `SELECT COUNT(*) as total FROM devices${conditions.length ? ' WHERE ' + conditions.join(' AND ') : ''}`;
    const countParams = [...params];

    query += ` ORDER BY ${sortBy} ${sortOrder}`;
    query += ` OFFSET ? ROWS FETCH NEXT ? ROWS ONLY`;
    params.push((page - 1) * pageSize);
    params.push(pageSize);

    const devices = await database.execute(query, params);
    const totalResult = await database.execute(countQuery, countParams);

    return {
      devices,
      total: totalResult[0]?.total || 0
    };
  },

  getStatus: async () => {
    const [light, fan, airConditioner] = await deviceModel.getRecentStatus();

    mqttHandler.publishDeviceControl("light", light);
    mqttHandler.publishDeviceControl("fan", fan);
    mqttHandler.publishDeviceControl("aircon", airConditioner);

    return [light, fan, airConditioner];
  },

  toggle: async (devices) => {
    try {
      // Publish and log each device separately
      for (const device of devices) {
        const { device: name, state } = device;
        const stateStr = state ? 'on' : 'off';

        // ✅ Publish to MQTT
        if (mqttHandler?.publishDeviceControl) {
          mqttHandler.publishDeviceControl(name, state);
        } else {
          throw new Error("❌ mqttHandler.publishDeviceControl is undefined");
        };
      }

      return null;
    } catch (error) {
      console.error('Error toggling LED:', error.message);
      return 500;
    }
  },

  deleteAll: async () => {
    await database.execute('DELETE FROM devices');
    return await database.execute("DBCC CHECKIDENT ('devices', RESEED, 0)");
  },

  deleteOne: async (id) => {
    return await database.execute('DELETE FROM devices WHERE id = ?', [id]);
  },
};

module.exports = { deviceService };
