import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { SensorData } from '../../context/DataContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SensorChartProps {
  data: SensorData[];
  limit?: number;
}

const SensorChart: React.FC<SensorChartProps> = ({ data, limit = 10 }) => {
  // Sort by timestamp in descending order and limit the number of points
  const limitedData = [...data]
    .sort((a, b) => {
      const [timeA] = a.timestamp.split(' ');
      const [timeB] = b.timestamp.split(' ');
      return timeA.localeCompare(timeB);
    })
    .slice(-limit);
  
  const labels = limitedData.map(d => d.timestamp.split(' ')[0]); // Get HH:mm:ss part

  const temperatureData = {
    labels,
    datasets: [
      {
        label: 'Nhiệt độ (°C)',
        data: limitedData.map(d => d.temp),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const humidityData = {
    labels,
    datasets: [
      {
        label: 'Độ ẩm (%)',
        data: limitedData.map(d => d.hum),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const lightData = {
    labels,
    datasets: [
      {
        label: 'Ánh sáng (lux)',
        data: limitedData.map(d => d.light),
        borderColor: 'rgb(255, 205, 86)',
        backgroundColor: 'rgba(255, 205, 86, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10
        }
      }
    }
  };

  const temperatureOptions = {
    ...commonOptions,
    scales: {
      ...commonOptions.scales,
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Temperature (°C)'
        }
      }
    }
  };

  const humidityOptions = {
    ...commonOptions,
    scales: {
      ...commonOptions.scales,
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Humidity (%)'
        }
      }
    }
  };

  const lightOptions = {
    ...commonOptions,
    scales: {
      ...commonOptions.scales,
      y: {
        beginAtZero: true,
        max: 1000,
        title: {
          display: true,
          text: 'Light (lux)'
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="bg-white p-4 rounded-xl shadow-md h-64">
        <Line data={temperatureData} options={temperatureOptions} />
      </div>
      <div className="bg-white p-4 rounded-xl shadow-md h-64">
        <Line data={humidityData} options={humidityOptions} />
      </div>
      <div className="bg-white p-4 rounded-xl shadow-md h-64">
        <Line data={lightData} options={lightOptions} />
      </div>
    </div>
  );
};

export default SensorChart;