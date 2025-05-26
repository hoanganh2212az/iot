const { ErrorConstants } = require('../constants/error.constant');
const { deviceService } = require('../services/device.service');

const deviceController = {
  getAll: async (req, res) => {
    const pageSize = parseInt(req.query.pageSize) || 10;
    const page = parseInt(req.query.page) || 1;
    const dateSearch = req.query.date;

    let sortBy = req.query.sortBy ?? 'device_name';
    if (sortBy === 'device') sortBy = 'device_name';

    const sortOrder = req.query.sortOrder ?? 'ASC';

    try {
      const result = await deviceService.getAll(
        pageSize,
        page,
        dateSearch,
        sortBy,
        sortOrder
      );

      res.status(200).json(result);
    } catch (error) {
      console.error("❌ Lỗi khi lấy dữ liệu device:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },

  getStatus: async (req, res) => {
    const status = await deviceService.getStatus();
    return res
      .status(200)
      .json({ light: status[0], fan: status[1], airConditioner: status[2] });
  },

  toggle: async (req, res) => {
    const light = req.body.light;
    const fan = req.body.fan;
    const aircon = req.body.aircon; 

    const devices = [];

    if (light !== undefined) devices.push({ device: 'light', state: light });
    if (fan !== undefined) devices.push({ device: 'fan', state: fan });
    if (aircon !== undefined) devices.push({ device: 'aircon', state: aircon }); 

    console.log("📥 Toggle request received:", devices);

    const errorCode = await deviceService.toggle(devices); //nhận req từ FE --> chuyển sang service

    if (!errorCode) {
      return res.status(200).json({
        message: "Thiết bị đã được cập nhật thành công.",
      });
    }

    return res.status(errorCode).json({ message: "Lỗi khi cập nhật thiết bị." });
  },

  deleteAll: async (req, res) => {
    try {
      await deviceService.deleteAll();
      res.status(200).json({ message: "Đã xóa toàn bộ lịch sử thiết bị." });
    } catch (error) {
      console.error("❌ Lỗi khi xóa toàn bộ device logs:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },

  deleteOne: async (req, res) => {
    const id = req.params.id;
    try {
      await deviceService.deleteOne(id);
      res.status(200).json({ message: `Đã xóa bản ghi thiết bị ID ${id}` });
    } catch (error) {
      console.error(`❌ Lỗi khi xóa device ID ${id}:`, error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },
};

module.exports = { deviceController };
