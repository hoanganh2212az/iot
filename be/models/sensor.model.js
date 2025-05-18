const { database } = require('../config/database');

const sensorModel = {
  getAll: async (pageSize, page, filterBy, filterValue, sortBy, sortOrder) => {
    const limit = parseInt(pageSize);
    const offset = parseInt((page - 1) * pageSize);
    let query = `SELECT * FROM sensors`;
    const params = [];

    if (filterBy && filterValue) {
      query += ` WHERE ${filterBy} = ?`;
      params.push(filterValue);
    }

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
      temperature: row.temp,
      humidity: row.hum,
      light: row.light,
      time: row.timestamp,
    }));
  },

  create: async (data) => {
    const query = `INSERT INTO sensors (temp, hum, light, timestamp) VALUES (?, ?, ?, ?)`;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const params = [data.temperature, data.humidity, data.light, now];
    const res = await database.execute(query, params);
    return res;
  },
};

module.exports = { sensorModel };
