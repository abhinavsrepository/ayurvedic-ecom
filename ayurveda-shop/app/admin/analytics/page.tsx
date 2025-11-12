'use client';

import { useState, useEffect } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import {
  getMockFunnelData,
  getMockCohortData,
  getMockUTMData,
  generateTimeSeriesData,
  generateProductPerformance,
  generateCustomerSegments,
  getMockTrafficSources,
  getMockDeviceBreakdown,
  getMockGeographicData,
} from '@/lib/mocks/analytics';
import { TrendingUp, Users, Target, DollarSign, Globe, Smartphone, MapPin } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [funnelData, setFunnelData] = useState<any>(null);
  const [cohortData, setCohortData] = useState<any>(null);
  const [utmData, setUtmData] = useState<any>(null);
  const [revenueChart, setRevenueChart] = useState<any>(null);
  const [productPerformance, setProductPerformance] = useState<any[]>([]);
  const [customerSegments, setCustomerSegments] = useState<any[]>([]);
  const [trafficSources, setTrafficSources] = useState<any[]>([]);
  const [deviceData, setDeviceData] = useState<any>(null);
  const [geographicData, setGeographicData] = useState<any[]>([]);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = () => {
    // Funnel Data
    const funnel = getMockFunnelData();
    setFunnelData({
      labels: funnel.map(f => f.stage),
      datasets: [
        {
          label: 'Users',
          data: funnel.map(f => f.users),
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
        },
      ],
    });

    // Cohort Data
    const cohort = getMockCohortData();
    setCohortData(cohort);

    // UTM Data
    const utm = getMockUTMData();
    setUtmData(utm);

    // Revenue Time Series
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const timeSeries = generateTimeSeriesData(days);
    setRevenueChart({
      labels: timeSeries.map(t => new Date(t.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Revenue (₹)',
          data: timeSeries.map(t => t.revenue),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    });

    // Product Performance
    setProductPerformance(generateProductPerformance());

    // Customer Segments
    setCustomerSegments(generateCustomerSegments());

    // Traffic Sources
    setTrafficSources(getMockTrafficSources());

    // Device Breakdown
    const devices = getMockDeviceBreakdown();
    setDeviceData({
      labels: devices.map(d => d.device),
      datasets: [
        {
          label: 'Sessions',
          data: devices.map(d => d.sessions),
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

    // Geographic Data
    setGeographicData(getMockGeographicData());
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Deep dive into your store's performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === '7d'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === '30d'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange('90d')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === '90d'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* Revenue Trend */}
      {revenueChart && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenue Trend
          </h2>
          <div className="h-80">
            <Line data={revenueChart} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Conversion Funnel & UTM Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        {funnelData && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Conversion Funnel
            </h2>
            <div className="h-80">
              <Bar
                data={funnelData}
                options={{
                  ...chartOptions,
                  indexAxis: 'y' as const,
                }}
              />
            </div>
          </div>
        )}

        {/* Top UTM Campaigns */}
        {utmData && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Top Marketing Campaigns
            </h2>
            <div className="overflow-y-auto max-h-80">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Campaign
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Sessions
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Revenue
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      ROAS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {utmData.slice(0, 10).map((utm: any, idx: number) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-gray-900 dark:text-white">
                        <div className="font-medium">{utm.campaign}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {utm.source} / {utm.medium}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">
                        {utm.sessions.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-gray-900 dark:text-white">
                        ₹{utm.revenue.toLocaleString('en-IN')}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className={`font-medium ${
                          utm.roas >= 3 ? 'text-green-600' : utm.roas >= 2 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {utm.roas.toFixed(2)}x
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Cohort Analysis */}
      {cohortData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Cohort Retention Analysis
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Cohort
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Month 0
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Month 1
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Month 2
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Month 3
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Month 4
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Month 5
                  </th>
                </tr>
              </thead>
              <tbody>
                {cohortData.map((cohort: any, idx: number) => (
                  <tr key={idx} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">
                      {cohort.cohort}
                    </td>
                    {[cohort.month0, cohort.month1, cohort.month2, cohort.month3, cohort.month4, cohort.month5].map((value, i) => {
                      const bgColor =
                        value >= 50 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                        value >= 30 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                        value >= 15 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                        'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';

                      return (
                        <td key={i} className="px-4 py-2 text-center">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${bgColor}`}>
                            {value ? `${value.toFixed(1)}%` : '-'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            * Retention rate shows the percentage of customers who made repeat purchases in subsequent months
          </p>
        </div>
      )}

      {/* Product Performance */}
      {productPerformance.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Top Performing Products
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Units Sold
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Views
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Conversion Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {productPerformance.map((product, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {product.productName}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-gray-900 dark:text-white">
                      ₹{product.revenue.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-700 dark:text-gray-300">
                      {product.units.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-700 dark:text-gray-300">
                      {product.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <span className={`font-medium ${
                        product.conversionRate >= 5 ? 'text-green-600' :
                        product.conversionRate >= 3 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {product.conversionRate.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Segments */}
      {customerSegments.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Customer Segments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customerSegments.map((segment) => (
              <div key={segment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{segment.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Customers:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {segment.customerCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Avg LTV:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ₹{segment.avgLTV.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Avg AOV:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ₹{segment.avgOrderValue.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Criteria:</p>
                    {segment.criteria.map((c: string, i: number) => (
                      <p key={i} className="text-xs text-gray-500 dark:text-gray-400">• {c}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Traffic Sources */}
      {trafficSources.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Traffic Sources
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trafficSources.map((source, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900 text-lg">
                      {source.source}
                    </span>
                    <span className="text-sm font-medium text-gray-500">
                      {source.sessions.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sessions:</span>
                      <span className="font-medium text-gray-900">{source.sessions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Percentage:</span>
                      <span className="font-medium text-green-600">{source.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bounce Rate:</span>
                      <span className="font-medium text-gray-900">{source.bounceRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Duration:</span>
                      <span className="font-medium text-gray-900">
                        {Math.floor(source.avgSessionDuration / 60)}m {source.avgSessionDuration % 60}s
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Device Analytics - Separate Section */}
      {deviceData && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Smartphone className="w-5 h-5 mr-2" />
              Device Analytics & Usage
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Understanding how users access your platform across different devices
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Doughnut Chart */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md">
                  <Doughnut
                    data={deviceData}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          position: 'bottom' as const,
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Device Stats Cards */}
              <div className="space-y-4">
                {getMockDeviceBreakdown().map((device, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{device.device}</h3>
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
      )}

      {/* Geographic Distribution - Separate Section */}
      {geographicData.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Geographic Distribution - Top Cities in India
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Performance metrics across major Indian cities
            </p>
          </div>
          <div className="p-6">
            {/* Geographic Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-green-50 to-white">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 font-medium">Top Performing City</p>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {geographicData[0]?.city}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  ₹{geographicData[0]?.revenue.toLocaleString('en-IN')} revenue
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 font-medium">Highest Traffic</p>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {geographicData[0]?.city}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {geographicData[0]?.sessions.toLocaleString()} sessions
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-white">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 font-medium">Best Conversion</p>
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {geographicData.reduce((best, loc) =>
                    (loc.orders / loc.sessions) > (best.orders / best.sessions) ? loc : best
                  ).city}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {((geographicData.reduce((best, loc) =>
                    (loc.orders / loc.sessions) > (best.orders / best.sessions) ? loc : best
                  ).orders / geographicData.reduce((best, loc) =>
                    (loc.orders / loc.sessions) > (best.orders / best.sessions) ? loc : best
                  ).sessions) * 100).toFixed(2)}% conv rate
                </p>
              </div>
            </div>

            {/* Geographic Data Table */}
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
                      {geographicData.reduce((sum, loc) => sum + loc.sessions, 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">
                      {geographicData.reduce((sum, loc) => sum + loc.orders, 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">
                      ₹{geographicData.reduce((sum, loc) => sum + loc.revenue, 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">
                      {((geographicData.reduce((sum, loc) => sum + loc.orders, 0) / geographicData.reduce((sum, loc) => sum + loc.sessions, 0)) * 100).toFixed(2)}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
