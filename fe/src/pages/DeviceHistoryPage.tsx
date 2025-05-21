import React, { useEffect, useState } from 'react';
import DataTable from '../components/tables/DataTable';

interface DeviceData {
  id: number;
  name: string;
  status: boolean;
  timestamp: string;
}

const DeviceHistoryPage: React.FC = () => {
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>('timestamp');
  const [sortOrder, setSortOrder] = useState<string>('DESC');
  const [searchTimestamp, setSearchTimestamp] = useState<string>('');

  const fetchDeviceData = async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      sortBy,
      sortOrder,
    });

    if (searchTimestamp.trim()) {
      params.append('date', searchTimestamp);
    }

    try {
      const res = await fetch(`http://localhost:3000/device?${params.toString()}`);
      const data = await res.json();
      const raw = data.devices || [];

      const normalized = raw.map((item: any) => ({
        id: item.id,
        name: item.device_name,
        status: item.state === 'on',
        timestamp: item.timestamp,
      }));

      setDeviceData(normalized);
      setTotalCount(data.total || normalized.length);
    } catch (err) {
      console.error('❌ Failed to fetch device data:', err);
    }
  };

  useEffect(() => {
    fetchDeviceData();
  }, [page, pageSize, sortBy, sortOrder]);

  const handleSearch = () => {
    setPage(1);
    fetchDeviceData();
  };

  const resetFilters = () => {
    setSearchTimestamp('');
    setPage(1);
    fetchDeviceData();
  };

  const handleDeleteAll = () => {
    fetch('http://localhost:3000/device', {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.ok) {
          setDeviceData([]);
          setTotalCount(0);
          console.log('🗑 All device data deleted');
        } else {
          throw new Error('Failed to delete');
        }
      })
      .catch((err) => console.error('❌ Delete failed:', err));
  };

  const handleDeleteRow = (id: string) => {
    fetch(`http://localhost:3000/device/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.ok) {
          console.log(`🗑 Row ${id} deleted`);
          fetchDeviceData();
        } else {
          throw new Error('Failed to delete row');
        }
      })
      .catch((err) => console.error('❌ Delete row error:', err));
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleSortOrder = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'id' as keyof DeviceData,
    },
    {
      header: 'Tên thiết bị',
      accessor: 'name' as keyof DeviceData,
      render: (value: string) => ({
        light: 'Đèn',
        fan: 'Quạt',
        aircon: 'Điều hòa'
      }[value] || value)
    },
    {
      header: 'Trạng thái',
      accessor: 'status' as keyof DeviceData,
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'BẬT' : 'TẮT'}
        </span>
      )
    },
    {
      header: 'Thời gian',
      accessor: 'timestamp' as keyof DeviceData,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Lịch sử bật/tắt thiết bị</h1>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
              Sắp xếp theo
            </label>
            <select
              id="sortBy"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={sortBy}
              onChange={handleSort}
            >
              <option value="timestamp">Thời gian</option>
              <option value="device">Thiết bị</option>
            </select>
          </div>
          <div>
            <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
              Thứ tự
            </label>
            <select
              id="sortOrder"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={sortOrder}
              onChange={handleSortOrder}
            >
              <option value="ASC">Cũ nhất</option>
              <option value="DESC">Mới nhất</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
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
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Xóa dữ liệu
          </button>
        </div>
      </div>

      <DataTable
        data={deviceData}
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

export default DeviceHistoryPage;