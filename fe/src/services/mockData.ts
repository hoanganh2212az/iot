import { SensorData, DeviceData } from '../types';
import { format, subMinutes } from 'date-fns';

export const generateMockSensorData = (count: number): SensorData[] => {
  const now = new Date();
  const data: SensorData[] = [];

  for (let i = 0; i < count; i++) {
    const timestamp = subMinutes(now, 5 * i);
    data.push({
      id: `sensor-${i}`,
      temperature: Math.floor(Math.random() * 101), // 0-100°C
      humidity: Math.floor(Math.random() * 101), // 0-100%
      light: Math.floor(Math.random() * 1001), // 0-1000 lux
      timestamp: format(timestamp, 'HH:mm:ss dd/MM/yyyy')
    });
  }

  return data;
};

export const generateMockDeviceData = (count: number): DeviceData[] => {
  const now = new Date();
  const data: DeviceData[] = [];
  const deviceNames = ['Đèn', 'Quạt', 'Điều hòa'];

  for (let i = 0; i < count; i++) {
    const timestamp = subMinutes(now, 15 * i);
    data.push({
      id: `device-${i}`,
      name: deviceNames[i % 3],
      status: Math.random() > 0.5,
      timestamp: format(timestamp, 'HH:mm:ss dd/MM/yyyy')
    });
  }

  return data;
};