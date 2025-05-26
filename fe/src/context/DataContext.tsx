import React, { createContext, useContext, useEffect, useState } from 'react';
import mqttService from '../services/mqttService';
import { formatTimestamp } from '../utils/formatDate';

export interface SensorData {
  id: number;
  temp: number;
  hum: number;
  light: number;
  timestamp: string;
}

interface DeviceData {
  id: number;
  name: string;
  status: boolean;
  timestamp: string;
}

interface DataContextType {
  sensorData: SensorData[];
  deviceData: DeviceData[];
  devices: {
    light: boolean;
    fan: boolean;
    aircon: boolean;
  };
  setSensorData: React.Dispatch<React.SetStateAction<SensorData[]>>;
  setDeviceData: React.Dispatch<React.SetStateAction<DeviceData[]>>;
  setDevices: React.Dispatch<
    React.SetStateAction<{
      light: boolean;
      fan: boolean;
      aircon: boolean;
    }>
  >;
  toggleDevice: (device: string) => void;
}

const DataContext = createContext<DataContextType>({} as DataContextType);

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [devices, setDevices] = useState({
    light: false,
    fan: false,
    aircon: false,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch device status
        const deviceRes = await fetch('http://localhost:3000/device/status');
        const deviceData = await deviceRes.json();
        setDevices({
          light: deviceData.light,
          fan: deviceData.fan,
          aircon: deviceData.airConditioner,
        });

        // Fetch latest sensor data
        const sensorRes = await fetch('http://localhost:3000/sensor?pageSize=1&page=1&sortBy=timestamp&sortOrder=DESC');
        const sensorData = await sensorRes.json();
        if (sensorData.sensors && sensorData.sensors.length > 0) {
        const normalizedData = sensorData.sensors.map((sensor: any) => ({
          id: sensor.id,
          temp: sensor.temp || sensor.temperature,
          hum: sensor.hum || sensor.humidity,
          light: sensor.light,
          timestamp: formatTimestamp(sensor.time || sensor.timestamp),
        }));
          setSensorData(normalizedData);
        }
      } catch (err) {
        console.error("❌ Failed to fetch initial data:", err);
      }
    };

    fetchInitialData();

    mqttService.connect();
    mqttService.subscribeToSensorData((entry) => {
      setSensorData((prev) => [entry, ...prev]);
    });

    mqttService.subscribeToDeviceData((entry) => {
      setDeviceData((prev) => [entry, ...prev]);
    });

    return () => mqttService.disconnect();
  }, []);

  const toggleDevice = async (device: string) => {
    if (device in devices) {
      const newStatus = !devices[device as keyof typeof devices];
      setDevices((prev) => ({ ...prev, [device]: newStatus }));

      try {
        await fetch('http://localhost:3000/device/toggle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ [device]: newStatus }),
        });

        console.log(`📦 Sent ${device}=${newStatus ? 'on' : 'off'} to backend`);
      } catch (error) {
        console.error(`❌ Failed to log ${device} toggle to DB:`, error);
      }
    }
  };

  return (
    <DataContext.Provider
      value={{
        sensorData,
        deviceData,
        devices,
        setSensorData,
        setDeviceData,
        setDevices,
        toggleDevice,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};