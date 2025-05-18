const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const { routes } = require('./routes/index.route');
const { database } = require('./config/database');
const { mqttHandler } = require('./config/mqtt'); // ✅ use mqttHandler only

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

database.connect().then(() => {
  routes(app);

  // ❌ REMOVE this if still present:
  // MQTTService.getInstance();

  app.listen(3000, () => {
    console.log('✅ Server is running on http://localhost:3000');
  });
}).catch((err) => {
  console.error("❌ Không thể kết nối tới SQL Server:", err);
});
