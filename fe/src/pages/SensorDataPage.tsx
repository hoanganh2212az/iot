import React, { useState, useEffect } from 'react';
import DataTable from '../components/tables/DataTable';
import { Search, Delete } from 'lucide-react';
import { formatTimestamp } from '../utils/formatDate'; 

interface SensorData {
  id: number | string;
  temperature: number;
  humidity: number;
  light: number;
  timestamp: string;
}

const SensorDataPage: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>('timestamp');
  const [sortOrder, setSortOrder] = useState<string>('DESC');

  const [searchTemperature, setSearchTemperature] = useState<string>('');
  const [searchHumidity, setSearchHumidity] = useState<string>('');
  const [searchLight, setSearchLight] = useState<string>('');
  const [searchTimestamp, setSearchTimestamp] = useState<string>('');

  const fetchSensorData = async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      sortBy,
      sortOrder,
    });

    if (searchTemperature.trim()) params.append("temp", searchTemperature);
    if (searchHumidity.trim()) params.append("hum", searchHumidity);
    if (searchLight.trim()) params.append("light", searchLight);
    if (searchTimestamp.trim()) params.append("time", searchTimestamp);

    try {
      const res = await fetch(`http://localhost:3000/sensor?${params.toString()}`);
      const data = await res.json();
      const raw = data.sensors || [];

      const normalized = raw.map((item: any, index: number) => ({
        id: item.id || index,
        temperature: item.temp || item.temperature,
        humidity: item.hum || item.humidity,
        light: item.light,
        timestamp: item.time || item.timestamp,
      }));

      setSensorData(normalized);
      setTotalCount(data.total || normalized.length);
    } catch (err) {
      console.error("❌ Failed to fetch sensor data:", err);
    }
  };

  useEffect(() => {
    fetchSensorData();
  }, [page, pageSize, sortBy, sortOrder]);

  const handleSearch = () => {
    setPage(1);
    fetchSensorData();
  };

  const resetFilters = () => {
    setSearchTemperature('');
    setSearchHumidity('');
    setSearchLight('');
    setSearchTimestamp('');
    setPage(1);
    fetchSensorData();
  };

  const handleDeleteAll = () => {
    fetch('http://localhost:3000/sensor', {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.ok) {
          setSensorData([]);
          setTotalCount(0);
          console.log("🗑 All sensor data deleted");
        } else {
          throw new Error("Failed to delete");
        }
      })
      .catch((err) => console.error("❌ Delete failed:", err));
  };

  const handleDeleteRow = (id: string) => {
    fetch(`http://localhost:3000/sensor/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.ok) {
          console.log(`🗑 Row ${id} deleted`);
          fetchSensorData();
        } else {
          throw new Error("Failed to delete row");
        }
      })
      .catch((err) => console.error("❌ Delete row error:", err));
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleSortOrder = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  const columns = [
    { header: 'ID', accessor: 'id' as keyof SensorData },
    { header: 'Nhiệt độ (°C)', accessor: 'temperature' as keyof SensorData },
    { header: 'Độ ẩm (%)', accessor: 'humidity' as keyof SensorData },
    { header: 'Ánh sáng (lux)', accessor: 'light' as keyof SensorData },
    {
      header: 'Thời gian',
      accessor: 'timestamp' as keyof SensorData,
      render: (value: string) => formatTimestamp(value),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dữ liệu cảm biến</h1>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
              Nhiệt độ (°C)
            </label>
            <input
              id="temperature"
              type="number"
              step="0.1"
              placeholder="Nhập nhiệt độ..."
              className="w-full p-2 border border-gray-300 rounded-md"
              value={searchTemperature}
              onChange={e => setSearchTemperature(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="humidity" className="block text-sm font-medium text-gray-700 mb-1">
              Độ ẩm (%)
            </label>
            <input
              id="humidity"
              type="number"
              step="0.1"
              placeholder="Nhập độ ẩm..."
              className="w-full p-2 border border-gray-300 rounded-md"
              value={searchHumidity}
              onChange={e => setSearchHumidity(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="light" className="block text-sm font-medium text-gray-700 mb-1">
              Ánh sáng (lux)
            </label>
            <input
              id="light"
              type="number"
              step="0.1"
              placeholder="Nhập ánh sáng..."
              className="w-full p-2 border border-gray-300 rounded-md"
              value={searchLight}
              onChange={e => setSearchLight(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700 mb-1">
              Thời gian
            </label>
            <input
              id="timestamp"
              type="text"
              placeholder="YYYY-MM-DD HH:mm:ss"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={searchTimestamp}
              onChange={e => setSearchTimestamp(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="sortBy" className="text-gray-700">Sắp xếp theo:</label>
            <select
              id="sortBy"
              className="border border-gray-300 rounded-md px-3 py-2"
              value={sortBy}
              onChange={handleSort}
            >
              <option value="timestamp">Thời gian</option>
              <option value="temp">Nhiệt độ</option>
              <option value="hum">Độ ẩm</option>
              <option value="light">Ánh sáng</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="sortOrder" className="text-gray-700">Thứ tự:</label>
            <select
              id="sortOrder"
              className="border border-gray-300 rounded-md px-3 py-2"
              value={sortOrder}
              onChange={handleSortOrder}
            >
              {sortBy === 'timestamp' ? (
                <>
                  <option value="DESC">Mới nhất</option>
                  <option value="ASC">Cũ nhất</option>
                </>
              ) : (
                <>
                  <option value="ASC">Tăng dần</option>
                  <option value="DESC">Giảm dần</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center"
          >
            <Search size={18} className="mr-1" />
            Tìm kiếm
          </button>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
          >
            Tất cả
          </button>
          <button
            onClick={handleDeleteAll}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center"
          >
            <Delete size={18} className="mr-1" />
            Xóa
          </button>
        </div>
      </div>

      <DataTable
        data={sensorData}
        columns={columns}
        keyField="id"
        total={totalCount}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onDelete={handleDeleteRow}
      />
    </div>
  );
};

export default SensorDataPage;