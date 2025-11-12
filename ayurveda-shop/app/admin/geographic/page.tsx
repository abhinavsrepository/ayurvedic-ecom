'use client';

import { useState, useEffect } from 'react';
import { getMockGeographicData } from '@/lib/mocks/analytics';
import { MapPin, DollarSign, Users, Target, TrendingUp, Globe } from 'lucide-react';

export default function GeographicPage() {
  const [geographicData, setGeographicData] = useState<any[]>([]);

  useEffect(() => {
    setGeographicData(getMockGeographicData());
  }, []);

  const totalSessions = geographicData.reduce((sum, loc) => sum + loc.sessions, 0);
  const totalOrders = geographicData.reduce((sum, loc) => sum + loc.orders, 0);
  const totalRevenue = geographicData.reduce((sum, loc) => sum + loc.revenue, 0);
  const avgConversionRate = totalSessions > 0 ? (totalOrders / totalSessions) * 100 : 0;

  const topPerformer = geographicData.length > 0 ? geographicData[0] : null;
  const highestTraffic = geographicData.length > 0 ? geographicData[0] : null;
  const bestConversion = geographicData.reduce((best, loc) =>
    (loc.orders / loc.sessions) > (best.orders / best.sessions) ? loc : best,
    geographicData[0] || { orders: 0, sessions: 1 }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Geographic Distribution</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Performance metrics across major Indian cities
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
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {totalOrders.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Conv. Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {avgConversionRate.toFixed(2)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Top Performing Cities
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {topPerformer && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-green-50 to-white">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 font-medium">Top Performing City</p>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {topPerformer.city}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  ₹{topPerformer.revenue.toLocaleString('en-IN')} revenue
                </p>
              </div>
            )}
            {highestTraffic && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 font-medium">Highest Traffic</p>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {highestTraffic.city}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {highestTraffic.sessions.toLocaleString()} sessions
                </p>
              </div>
            )}
            {bestConversion && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-white">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 font-medium">Best Conversion</p>
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {bestConversion.city}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {((bestConversion.orders / bestConversion.sessions) * 100).toFixed(2)}% conv rate
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* City Cards Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            City Performance Overview
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {geographicData.map((location, idx) => {
              const convRate = (location.orders / location.sessions) * 100;
              return (
                <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {location.city}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{location.state}</p>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full font-semibold">
                      #{idx + 1}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Sessions:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {location.sessions.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Orders:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {location.orders.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Revenue:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        ₹{location.revenue.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Conv. Rate:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        convRate >= 6 ? 'bg-green-100 text-green-700' :
                        convRate >= 4 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {convRate.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Detailed Geographic Analysis
          </h2>
        </div>
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  City
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  State
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Sessions
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Orders
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Revenue
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Conv. Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {geographicData.map((location, idx) => {
                const convRate = (location.orders / location.sessions) * 100;
                return (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-500">
                      <span className="font-semibold">#{idx + 1}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {location.city}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {location.state}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">
                      {location.sessions.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                      {location.orders.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">
                      ₹{location.revenue.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        convRate >= 6 ? 'bg-green-100 text-green-700' :
                        convRate >= 4 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {convRate.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50 font-semibold">
              <tr className="border-t-2 border-gray-300">
                <td colSpan={3} className="px-4 py-3 text-sm text-gray-900">
                  Total (All Cities)
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-900">
                  {totalSessions.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-900">
                  {totalOrders.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-900">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-900">
                  {avgConversionRate.toFixed(2)}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
