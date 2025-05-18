const { database } = require('../config/database');

const sensorService = {
  getAll: async (pageSize, page, filters, sortBy, sortOrder) => {
    let query = 'SELECT * FROM sensors';
    const conditions = [];
    const params = [];

    // Filtering
    if (filters.temp) {
      conditions.push('temp = ?');
      params.push(filters.temp);
    }
    if (filters.hum) {
      conditions.push('hum = ?');
      params.push(filters.hum);
    }
    if (filters.light) {
      conditions.push('light = ?');
      params.push(filters.light);
    }
    if (filters.time) {
      conditions.push('timestamp LIKE ?');
      params.push(`%${filters.time}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Clone params for count query (without pagination)
    const countParams = [...params];

    // Sorting and pagination
    query += ` ORDER BY ${sortBy} ${sortOrder}`;
    query += ` OFFSET ? ROWS FETCH NEXT ? ROWS ONLY`;

    // Add pagination parameters
    params.push((page - 1) * pageSize);
    params.push(pageSize);

    const sensors = await database.execute(query, params);
    const countResult = await database.execute(
      `SELECT COUNT(*) as total FROM sensors${conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : ''}`,
      countParams
    );

    return {
      sensors,
      total: countResult[0]?.total || 0
    };
  },

  deleteAll: async () => {
    await database.execute('DELETE FROM sensors');
    await database.execute("DBCC CHECKIDENT ('sensors', RESEED, 0)");
  },

  deleteOne: async (id) => {
    return await database.execute('DELETE FROM sensors WHERE id = ?', [id]);
  },
};

module.exports = { sensorService };
