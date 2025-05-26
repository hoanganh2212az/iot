import React from 'react';
import SensorCard from '../components/sensors/SensorCard';
import DeviceControl from '../components/devices/DeviceControl';
import SensorChart from '../components/charts/SensorChart';
import { useData } from '../context/DataContext';

const HomePage: React.FC = () => {
  const { sensorData } = useData();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SensorCard 
          type="temperature" 
          value={sensorData[0]?.temp || 0} 
          unit="°C" 
        />
        <SensorCard 
          type="humidity" 
          value={sensorData[0]?.hum || 0} 
          unit="%" 
        />
        <SensorCard 
          type="light" 
          value={sensorData[0]?.light || 0} 
          unit=" lux" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <SensorChart data={sensorData} limit={10} />
        </div>
        
        <div className="space-y-4">
          <DeviceControl type="light" title="Trạng thái đèn" />
          <DeviceControl type="fan" title="Trạng thái quạt" />
          <DeviceControl type="aircon" title="Trạng thái điều hòa" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
