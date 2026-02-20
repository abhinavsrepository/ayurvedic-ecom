'use client';

import { useEffect, useState } from 'react';
import { Globe, TrendingUp, Users, ShoppingCart, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { analyticsApi, TrafficSource } from '@/lib/api/analytics';
import { toast } from 'sonner';
import { Spinner, PageLoader, CardSkeleton, TableSkeleton } from '@/components/shared/Spinner';

export default function TrafficSourcesPage() {
  const [trafficData, setTrafficData] = useState<TrafficSource[]>([]);
  const [summary, setSummary] = useState({
    totalVisits: 0,
    totalConversions: 0,
    totalRevenue: 0,
    avgConversionRate: '0.00',
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // days

  useEffect(() => {
    fetchTrafficData();
  }, [dateRange]);

  const fetchTrafficData = async () => {
    try {
      setLoading(true);
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await analyticsApi.getTrafficSources(startDate, endDate);
      setTrafficData(response.sources);
      setSummary(response.summary);
    } catch (error: any) {
      console.error('Failed to fetch traffic sources:', error);
      toast.error('Failed to load traffic sources');
      setTrafficData([]);
      setSummary({
        totalVisits: 0,
        totalConversions: 0,
        totalRevenue: 0,
        avgConversionRate: '0.00',
      });
    } finally {
      setLoading(false);
    }
  };

  const getSourceIcon = (name: string) => {
    switch (name) {
      case 'Organic Search':
        return '🔍';
      case 'Direct':
        return '🔗';
      case 'Social Media':
        return '📱';
      case 'Referral':
        return '👥';
      case 'Email':
        return '📧';
      case 'Paid Ads':
        return '💰';
      default:
        return '🌐';
    }
  };

  const getSourceColor = (name: string) => {
    switch (name) {
      case 'Organic Search':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Direct':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Social Media':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case 'Referral':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Email':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Paid Ads':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return ((value / total) * 100).toFixed(1);
  };

  if (loading && trafficData.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Traffic Sources</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Analyze where your visitors are coming from
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <TableSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Traffic Sources</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Analyze where your visitors are coming from
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Visits</p>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {summary.totalVisits.toLocaleString()}
          </p>
          <p className="text-xs text-green-600 mt-1 flex items-center">
            <ArrowUp className="w-3 h-3 mr-1" />
            All sources
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Conversions</p>
            <ShoppingCart className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {summary.totalConversions.toLocaleString()}
          </p>
          <p className="text-xs text-green-600 mt-1 flex items-center">
            <ArrowUp className="w-3 h-3 mr-1" />
            Orders from all sources
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            Rs.{summary.totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-green-600 mt-1 flex items-center">
            <ArrowUp className="w-3 h-3 mr-1" />
            Total revenue
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Conversion Rate</p>
            <Globe className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {summary.avgConversionRate}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Across all sources
          </p>
        </div>
      </div>

      {/* Traffic Sources Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Traffic Source Breakdown
          </h2>
        </div>

        {loading && trafficData.length === 0 ? (
          <TableSkeleton rows={6} />
        ) : trafficData.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No traffic data available</p>
            <p className="text-sm text-gray-500 mt-1">
              Data will appear once visitors start coming to your site
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Source
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Visits
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    % of Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Conversions
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Conv. Rate
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {trafficData.map((source) => (
                  <tr key={source.name} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getSourceIcon(source.name)}</span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{source.name}</p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSourceColor(source.name)}`}>
                            {source.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {source.visits.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${calculatePercentage(source.visits, summary.totalVisits)}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                          {calculatePercentage(source.visits, summary.totalVisits)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {source.conversions.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                        parseFloat(source.conversionRate) >= 5
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : parseFloat(source.conversionRate) >= 3
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {source.conversionRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Rs.{source.revenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {calculatePercentage(source.revenue, summary.totalRevenue)}% of total
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top Performing Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best Conversion Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Best Conversion Rates
          </h3>
          <div className="space-y-3">
            {[...trafficData]
              .sort((a, b) => parseFloat(b.conversionRate) - parseFloat(a.conversionRate))
              .slice(0, 3)
              .map((source, index) => (
                <div key={source.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    <span className="text-2xl mr-2">{getSourceIcon(source.name)}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{source.name}</span>
                  </div>
                  <span className="text-green-600 font-bold">{source.conversionRate}%</span>
                </div>
              ))}
          </div>
        </div>

        {/* Top Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Revenue Sources
          </h3>
          <div className="space-y-3">
            {[...trafficData]
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 3)
              .map((source, index) => (
                <div key={source.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    <span className="text-2xl mr-2">{getSourceIcon(source.name)}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{source.name}</span>
                  </div>
                  <span className="text-purple-600 font-bold">Rs.{source.revenue.toLocaleString()}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
