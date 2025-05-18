const { sensorService } = require('../services/sensor.service');

const sensorController = {
  getAll: async (req, res) => {
    const pageSize = parseInt(req.query.pageSize) || 10;
    const page = parseInt(req.query.page) || 1;
    const sortBy = req.query.sortBy || 'timestamp';
    const sortOrder = req.query.sortOrder || 'DESC';

    // Multiple filters support
    const filters = {
      temp: req.query.temp,
      hum: req.query.hum,
      light: req.query.light,
      time: req.query.time,
    };

    try {
      const result = await sensorService.getAll(
        pageSize,
        page,
        filters,
        sortBy,
        sortOrder
      );
      res.status(200).json(result); // { sensors, total }
    } catch (error) {
      console.error("❌ Lỗi khi lấy dữ liệu sensor:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },

  deleteAll: async (req, res) => {
    try {
      await sensorService.deleteAll();
      res.status(200).json({ message: "Đã xóa toàn bộ dữ liệu cảm biến." });
    } catch (error) {
      console.error("❌ Lỗi khi xóa toàn bộ sensor:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },

  deleteOne: async (req, res) => {
    const id = req.params.id;
    try {
      await sensorService.deleteOne(id);
      res.status(200).json({ message: `Đã xóa sensor ID ${id}` });
    } catch (error) {
      console.error(`❌ Lỗi khi xóa sensor ID ${id}:`, error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },
};

module.exports = { sensorController };
