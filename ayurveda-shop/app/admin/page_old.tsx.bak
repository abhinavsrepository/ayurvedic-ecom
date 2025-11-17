'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, ShoppingCart, Users, Activity } from 'lucide-react';
import { getMockSocket } from '@/lib/mocks/socket';
import { getMockOrders } from '@/lib/mocks/orders';
import type { KPIData } from '@/lib/mocks/analytics';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  format?: 'currency' | 'number' | 'percent';
}

function KPICard({ title, value, change, icon: Icon, format = 'number' }: KPICardProps) {
  const isPositive = change >= 0;
  const formattedValue =
    format === 'currency'
      ? `₹${typeof value === 'number' ? value.toLocaleString('en-IN') : value}`
      : format === 'percent'
      ? `${typeof value === 'number' ? value.toFixed(2) : value}%`
      : typeof value === 'number'
      ? value.toLocaleString('en-IN')
      : value;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{formattedValue}</p>
          <div className="mt-2 flex items-center text-sm">
            {isPositive ? (
              <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
              {Math.abs(change).toFixed(2)}%
            </span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
        <div className="ml-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <Icon className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [kpiData, setKpiData] = useState<KPIData>({
    gmv: 1245680,
    gmvChange: 12.5,
    aov: 1450,
    aovChange: 3.2,
    conversionRate: 3.45,
    conversionChange: 0.8,
    activeUsers: 342,
    activeUsersChange: 15.3,
    ordersToday: 67,
    revenueToday: 97250,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    // Load initial data
    const orders = getMockOrders();
    setRecentOrders(orders.slice(0, 10));

    // Generate chart data
    generateChartData();

    // Setup real-time KPI updates
    const socket = getMockSocket();

    socket.on('kpi:update', (data: KPIData) => {
      setKpiData(data);
    });

    socket.on('order:new', (order: any) => {
      setRecentOrders(prev => [order, ...prev.slice(0, 9)]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const generateChartData = () => {
    const labels = [];
    const revenueData = [];
    const ordersData = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
      revenueData.push(Math.floor(Math.random() * 50000) + 30000);
      ordersData.push(Math.floor(Math.random() * 50) + 20);
    }

    setChartData({
      labels,
      datasets: [
        {
          label: 'Revenue (₹)',
          data: revenueData,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: 'Orders',
          data: ordersData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y1',
        },
      ],
    });
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Revenue (₹)',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Orders',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Gross Merchandise Value"
          value={kpiData.gmv}
          change={kpiData.gmvChange}
          icon={DollarSign}
          format="currency"
        />
        <KPICard
          title="Average Order Value"
          value={kpiData.aov}
          change={kpiData.aovChange}
          icon={TrendingUp}
          format="currency"
        />
        <KPICard
          title="Conversion Rate"
          value={kpiData.conversionRate}
          change={kpiData.conversionChange}
          icon={Activity}
          format="percent"
        />
        <KPICard
          title="Active Users"
          value={kpiData.activeUsers}
          change={kpiData.activeUsersChange}
          icon={Users}
          format="number"
        />
      </div>

      {/* Today's stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Orders Today</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {kpiData.ordersToday}
              </p>
            </div>
            <ShoppingCart className="w-12 h-12 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue Today</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                ₹{kpiData.revenueToday.toLocaleString('en-IN')}
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-green-500" />
          </div>
        </div>
      </div>

      {/* Revenue & Orders Chart */}
      {chartData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenue & Orders Trend (Last 30 Days)
          </h2>
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : order.status === 'shipped'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        : order.status === 'processing'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ₹{order.total.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
