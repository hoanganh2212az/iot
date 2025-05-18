import React from 'react';
import { Lightbulb, Fan, Wind } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface DeviceControlProps {
  type: 'light' | 'fan' | 'aircon';
  title: string;
}

const DeviceControl: React.FC<DeviceControlProps> = ({ type, title }) => {
  const { devices, toggleDevice } = useData();
  const isActive = devices[type];

  const getIcon = () => {
    switch (type) {
      case 'light':
        return <Lightbulb size={48} className={`transition-colors duration-300 ${isActive ? 'text-yellow-400' : 'text-gray-500'}`} />;
      case 'fan':
        return <Fan size={48} className={`transition-colors duration-300 ${isActive ? 'text-blue-500' : 'text-gray-500'}`} />;
      case 'aircon':
        return <Wind size={48} className={`transition-colors duration-300 ${isActive ? 'text-cyan-500' : 'text-gray-500'}`} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
      <h3 className="text-center font-medium text-gray-700 mb-4">{title}</h3>
      <div className="mb-4">
        {getIcon()}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={isActive}
          onChange={() => toggleDevice(type)}
          title={`Toggle ${title}`} // ✅
        />
        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
};

export default DeviceControl;