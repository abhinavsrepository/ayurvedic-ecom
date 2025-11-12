'use client';

import { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { getMockDeviceBreakdown } from '@/lib/mocks/analytics';
import { Smartphone, Monitor, Tablet, TrendingUp, DollarSign, Target } from 'lucide-react';

export default function DeviceAnalyticsPage() {
  const [deviceData, setDeviceData] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    const devicesData = getMockDeviceBreakdown();
    setDevices(devicesData);

    setDeviceData({
      labels: devicesData.map(d => d.device),
      datasets: [
        {
          label: 'Sessions',
          data: devicesData.map(d => d.sessions),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',   // Blue for Mobile
            'rgba(34, 197, 94, 0.8)',    // Green for Desktop
            'rgba(168, 85, 247, 0.8)',   // Purple for Tablet
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(34, 197, 94, 1)',
            'rgba(168, 85, 247, 1)',
          ],
          borderWidth: 1,
        },
      ],
    });
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const getDeviceIcon = (deviceName: string) => {
    switch (deviceName) {
      case 'Mobile':
        return <Smartphone className="w-8 h-8" />;
      case 'Desktop':
        return <Monitor className="w-8 h-8" />;
      case 'Tablet':
        return <Tablet className="w-8 h-8" />;
      default:
        return <Smartphone className="w-8 h-8" />;
    }
  };

  const totalSessions = devices.reduce((sum, d) => sum + d.sessions, 0);
  const totalRevenue = devices.reduce((sum, d) => sum + d.revenue, 0);
  const avgConversionRate = devices.length > 0
    ? (devices.reduce((sum, d) => sum + d.conversionRate, 0) / devices.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Device Analytics & Usage</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Understanding how users access your platform across different devices
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {totalSessions.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{(totalRevenue / 100000).toFixed(1)}L
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Conversion</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {avgConversionRate.toFixed(2)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Device Types</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {devices.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Smartphone className="w-5 h-5 mr-2" />
            Device Distribution
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Doughnut Chart */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md h-80">
                {deviceData && (
                  <Doughnut data={deviceData} options={chartOptions} />
                )}
              </div>
            </div>

            {/* Device Stats Cards */}
            <div className="space-y-4">
              {devices.map((device, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`${
                        device.device === 'Mobile' ? 'text-blue-600' :
                        device.device === 'Desktop' ? 'text-green-600' : 'text-purple-600'
                      }`}>
                        {getDeviceIcon(device.device)}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{device.device}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      device.device === 'Mobile' ? 'bg-blue-100 text-blue-800' :
                      device.device === 'Desktop' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {device.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Sessions</p>
                      <p className="text-xl font-bold text-gray-900">{device.sessions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Conv. Rate</p>
                      <p className="text-xl font-bold text-green-600">{device.conversionRate.toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Revenue</p>
                      <p className="text-lg font-bold text-gray-900">₹{(device.revenue / 100000).toFixed(1)}L</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Market Share</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full ${
                            device.device === 'Mobile' ? 'bg-blue-600' :
                            device.device === 'Desktop' ? 'bg-green-600' : 'bg-purple-600'
                          }`}
                          style={{ width: `${device.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Device Performance Comparison
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Device Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Sessions
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Market Share
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Conv. Rate
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Revenue
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Avg Revenue/Session
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {devices.map((device, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`mr-3 ${
                        device.device === 'Mobile' ? 'text-blue-600' :
                        device.device === 'Desktop' ? 'text-green-600' : 'text-purple-600'
                      }`}>
                        {getDeviceIcon(device.device)}
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {device.device}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {device.sessions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <span className={`px-2 py-1 rounded-full font-medium ${
                      device.device === 'Mobile' ? 'bg-blue-100 text-blue-800' :
                      device.device === 'Desktop' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {device.percentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {device.conversionRate.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900 dark:text-white">
                    ₹{device.revenue.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    ₹{Math.floor(device.revenue / device.sessions).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-700 font-semibold">
              <tr className="border-t-2 border-gray-300 dark:border-gray-600">
                <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">
                  Total
                </td>
                <td className="px-6 py-3 text-sm text-right text-gray-900 dark:text-white">
                  {totalSessions.toLocaleString()}
                </td>
                <td className="px-6 py-3 text-sm text-right text-gray-900 dark:text-white">
                  100%
                </td>
                <td className="px-6 py-3 text-sm text-right text-gray-900 dark:text-white">
                  {avgConversionRate.toFixed(2)}%
                </td>
                <td className="px-6 py-3 text-sm text-right text-gray-900 dark:text-white">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </td>
                <td className="px-6 py-3 text-sm text-right text-gray-900 dark:text-white">
                  ₹{Math.floor(totalRevenue / totalSessions).toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
