const { database } = require('../config/database');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

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
      const parsedDate = dayjs(filters.time, ['HH:mm:ss DD/MM/YYYY', 'HH:mm:ss DD-MM-YYYY', 'H:m:s D/M/YYYY']);
      if (parsedDate.isValid()) {
        const formatted = parsedDate.format('YYYY-MM-DD HH:mm:ss');
        conditions.push('timestamp = ?');
        params.push(formatted);
      } else {
        console.warn('⚠️ Invalid time format received in sensor search:', filters.time);
      }
    }

    //GHÉP ĐIỀU KIỆN: e.g temp x và light y
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

    // TRUY VẤN CHÍNH!!
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
