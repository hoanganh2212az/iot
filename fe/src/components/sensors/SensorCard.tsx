import React from 'react';
import { Thermometer, Droplets, Sun, AlertTriangle } from 'lucide-react';

interface SensorCardProps {
  type: 'temperature' | 'humidity' | 'light';
  value: number;
  unit: string;
}

const SensorCard: React.FC<SensorCardProps> = ({ type, value, unit }) => {
  const getWarningStatus = () => {
    switch (type) {
      case 'temperature':
        return value > 40;
      case 'humidity':
        return value > 75;
      case 'light':
        return value > 800;
      default:
        return false;
    }
  };

  const getWarningMessage = () => {
    switch (type) {
      case 'temperature':
        return 'Nhiệt độ quá cao!';
      case 'humidity':
        return 'Độ ẩm quá cao!';
      case 'light':
        return 'Ánh sáng quá mạnh!';
      default:
        return '';
    }
  };

  const getCardStyle = () => {
    const isWarning = getWarningStatus();
    switch (type) {
      case 'temperature':
        return isWarning ? 'from-red-600 to-red-400' : 'from-red-500 to-red-300';
      case 'humidity':
        return isWarning ? 'from-blue-600 to-blue-400' : 'from-blue-500 to-blue-300';
      case 'light':
        return isWarning ? 'from-yellow-600 to-yellow-400' : 'from-yellow-500 to-yellow-300';
      default:
        return 'from-gray-500 to-gray-400';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'temperature':
        return <Thermometer size={48} className="mb-4" />;
      case 'humidity':
        return <Droplets size={48} className="mb-4" />;
      case 'light':
        return <Sun size={48} className="mb-4" />;
      default:
        return null;
    }
  };

  const isWarning = getWarningStatus();

  return (
    <div className={`flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-b ${getCardStyle()} shadow-lg text-white overflow-hidden transition-transform duration-300 hover:scale-105`}>
      {getIcon()}
      <div className="text-5xl font-bold mb-2">{value}{unit}</div>
      {isWarning && (
        <div className="flex items-center mt-2 bg-red-700 px-3 py-1 rounded-full animate-pulse">
          <AlertTriangle size={16} className="mr-1" />
          <span className="text-sm font-medium">{getWarningMessage()}</span>
        </div>
      )}
    </div>
  );
};

export default SensorCard;