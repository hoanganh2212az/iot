const { database } = require('../config/database');

const deviceModel = {
  getAll: async (pageSize, page, dateSearch, sortBy, sortOrder) => {
    const limit = parseInt(pageSize);
    const offset = parseInt((page - 1) * pageSize);
    let query = `SELECT * FROM devices`;
    const params = [];

    if (dateSearch) {
      query += ` WHERE timestamp LIKE ?`;
      params.push(dateSearch + '%');
    }

    // Đổi sortBy = device → device_name
    if (sortBy === 'device') sortBy = 'device_name';

    if (sortBy && sortOrder) {
      query += ` ORDER BY ${sortBy} ${sortOrder}`;
    } else {
      query += ` ORDER BY timestamp DESC`;
    }

    query += ' OFFSET ? ROWS FETCH NEXT ? ROWS ONLY';
    params.push(offset, limit);

    const res = await database.execute(query, params);
    return res.map((row) => ({
      id: row.id,
      device: row.device_name,
      state: row.state === 'on',
      time: row.timestamp,
    }));
  },

  getRecentStatus: async () => {
    const light = await database.execute(
      'SELECT TOP 1 state FROM devices WHERE device_name = ? ORDER BY id DESC',
      ['light']
    );
    const fan = await database.execute(
      'SELECT TOP 1 state FROM devices WHERE device_name = ? ORDER BY id DESC',
      ['fan']
    );
    const aircon = await database.execute(
      'SELECT TOP 1 state FROM devices WHERE device_name = ? ORDER BY id DESC',
      ['aircon'] 
    );

    return [
      light[0]?.state === 'on',
      fan[0]?.state === 'on',
      aircon[0]?.state === 'on',
    ];
  },

  create: async (device) => {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const res = await database.execute(
      'INSERT INTO devices (device_name, state, timestamp) VALUES (?, ?, ?)',
      [
        device.device,
        device.state ? 'on' : 'off',
        now
      ]
    );
    return res;
  },
};

module.exports = { deviceModel };
