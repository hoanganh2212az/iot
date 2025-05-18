import React, { useEffect, useState } from 'react';
import DataTable from '../components/tables/DataTable';
import { format, parseISO } from 'date-fns';

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

  const fetchDeviceData = async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      sortBy,
      sortOrder: 'DESC',
    });

    try {
      const res = await fetch(`http://localhost:3000/device?${params.toString()}`);
      const data = await res.json();
      const raw = data.devices || [];

      const normalized = raw.map((item: any) => ({
        id: item.id,
        name: item.device_name,
        status: item.state === 'on', // ✅ FIXED
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
  }, [page, pageSize, sortBy]);

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
      render: (value: string) => value // ✅ No parseISO
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Lịch sử bật/tắt thiết bị</h1>

      <div className="bg-white rounded-xl shadow-md p-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center space-x-2">
          <label htmlFor="sortBy" className="text-gray-700">Sắp xếp theo:</label>
          <select
            id="sortBy"
            className="border border-gray-300 rounded-md px-3 py-2"
            value={sortBy}
            onChange={handleSort}
          >
            <option value="timestamp">Thời gian</option>
            <option value="device">Thiết bị</option>
          </select>
        </div>

        <button
          onClick={handleDeleteAll}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Xóa dữ liệu
        </button>
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
