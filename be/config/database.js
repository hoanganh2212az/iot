const sql = require("mssql");

let pool;

const database = {
  connect: async () => {
    try {
      pool = await sql.connect({
        user: 'iot_user',               // Cập nhật thông tin đăng nhập
        password: '123456',
        server: 'localhost',            // Hoặc '127.0.0.1'
        database: 'iot_web',
        options: {
          encrypt: false,              // Đặt true nếu dùng Azure
          trustServerCertificate: true,
        },
      });
      console.log("✅ Kết nối thành công đến SQL Server!");
    } catch (err) {
      console.error("❌ Lỗi kết nối SQL Server:", err);
    }
  },

  execute: async (query, params = []) => {
    try {
      const request = pool.request();

      // Gán biến đầu vào đúng thứ tự
      params.forEach((param, index) => {
        request.input(`param${index}`, param);
      });

      // Thay thế từng dấu ? bằng @param0, @param1, ...
      let i = 0;
      const parsedQuery = query.replace(/\?/g, () => `@param${i++}`);

      const result = await request.query(parsedQuery);
      return result.recordset;
    } catch (err) {
      console.error("❌ Lỗi khi thực thi truy vấn:", err);
      return null;
    }
  }
};

module.exports = { database };
