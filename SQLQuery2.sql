USE iot_web;
GO

CREATE TABLE sensors (
  id INT IDENTITY(1,1) PRIMARY KEY,
  temp FLOAT,
  hum FLOAT,
  light INT,
  timestamp VARCHAR(50)
);

DECLARE @i INT = 0;

WHILE @i < 50
BEGIN
    INSERT INTO sensors (temp, hum, light, timestamp)
    VALUES (
        ROUND(RAND() * 10 + 25, 1),     -- temp: 25-35 °C
        ROUND(RAND() * 30 + 40, 1),     -- hum: 40-70%
        ROUND(RAND() * 1000, 0),        -- light: 0-1000 lux
        FORMAT(DATEADD(SECOND, -@i * 60, GETDATE()), 'HH:mm:ss dd/MM/yyyy')
    );

    SET @i += 1;
END


CREATE TABLE devices (
  id INT IDENTITY(1,1) PRIMARY KEY,
  device_name NVARCHAR(50),
  state VARCHAR(10),
  timestamp VARCHAR(50)
);

DECLARE @j INT = 0;

WHILE @j < 50
BEGIN
    INSERT INTO devices (device_name, state, timestamp)
    VALUES (
        CHOOSE((@j % 3) + 1, N'Đèn', N'Quạt', N'Điều hòa'),
        CHOOSE((@j % 2) + 1, 'on', 'off'),
        FORMAT(DATEADD(SECOND, -@j * 75, GETDATE()), 'HH:mm:ss dd/MM/yyyy')
    );

    SET @j += 1;
END


