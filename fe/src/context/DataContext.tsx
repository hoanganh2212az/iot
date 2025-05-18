import React, { createContext, useContext, useEffect, useState } from 'react';
import mqttService from '../services/mqttService'; // ✅ Singleton import

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

  // ✅ Load real device status from backend on first load
  useEffect(() => {
    fetch('http://localhost:3000/device/status')
      .then((res) => res.json())
      .then((data) => {
        setDevices({
          light: data.light,
          fan: data.fan,
          aircon: data.airConditioner,
        });
      })
      .catch((err) => {
        console.error("❌ Failed to fetch device status:", err);
      });
  }, []);

  useEffect(() => {
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
      mqttService.publishDeviceControl(device, newStatus);

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
