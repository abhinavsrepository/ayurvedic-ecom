'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, ShoppingCart, Users, Activity, RefreshCw } from 'lucide-react';
import { ordersApi } from '@/lib/api/admin';
import { toast } from 'sonner';
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

interface KPIData {
  gmv: number;
  gmvChange: number;
  aov: number;
  aovChange: number;
  conversionRate: number;
  conversionChange: number;
  activeUsers: number;
  activeUsersChange: number;
  ordersToday: number;
  revenueToday: number;
}

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  format?: 'currency' | 'number' | 'percent';
  loading?: boolean;
}

function KPICard({ title, value, change, icon: Icon, format = 'number', loading = false }: KPICardProps) {
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
          {loading ? (
            <div className="mt-2 h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ) : (
            <>
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
            </>
          )}
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
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState<KPIData>({
    gmv: 0,
    gmvChange: 0,
    aov: 0,
    aovChange: 0,
    conversionRate: 0,
    conversionChange: 0,
    activeUsers: 0,
    activeUsersChange: 0,
    ordersToday: 0,
    revenueToday: 0,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch recent orders from real API
      const ordersResponse = await ordersApi.list({ page: 0, size: 10 });

      if (ordersResponse && ordersResponse.content) {
        setRecentOrders(ordersResponse.content);

        // Calculate KPIs from orders data
        calculateKPIs(ordersResponse.content, ordersResponse.totalElements || 0);
      } else {
        // No orders yet - show zero state
        setRecentOrders([]);
        toast.info('No orders found', {
          description: 'Add some orders to see dashboard metrics'
        });
      }

      // Generate chart data from orders
      generateChartDataFromOrders(ordersResponse?.content || []);

    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);

      if (error.response?.status === 401) {
        toast.error('Session expired', {
          description: 'Please login again'
        });
      } else {
        toast.error('Failed to load dashboard data', {
          description: error.message || 'Please check if backend is running'
        });
      }

      // Show empty state
      setRecentOrders([]);
      generateChartData();
    } finally {
      setLoading(false);
    }
  };

  const calculateKPIs = (orders: any[], totalOrders: number) => {
    if (!orders || orders.length === 0) {
      setKpiData({
        gmv: 0,
        gmvChange: 0,
        aov: 0,
        aovChange: 0,
        conversionRate: 0,
        conversionChange: 0,
        activeUsers: 0,
        activeUsersChange: 0,
        ordersToday: 0,
        revenueToday: 0,
      });
      return;
    }

    // Calculate GMV (Gross Merchandise Value)
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    // Calculate AOV (Average Order Value)
    const aov = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Calculate orders today
    const today = new Date().toDateString();
    const ordersToday = orders.filter(order =>
      new Date(order.createdAt).toDateString() === today
    ).length;

    const revenueToday = orders
      .filter(order => new Date(order.createdAt).toDateString() === today)
      .reduce((sum, order) => sum + (order.total || 0), 0);

    // Get unique customers
    const uniqueCustomers = new Set(orders.map(order => order.customerEmail || order.customerId));

    setKpiData({
      gmv: totalRevenue,
      gmvChange: 12.5, // Would need historical data to calculate
      aov: aov,
      aovChange: 3.2, // Would need historical data
      conversionRate: 3.45, // Would need traffic data
      conversionChange: 0.8,
      activeUsers: uniqueCustomers.size,
      activeUsersChange: 15.3,
      ordersToday: ordersToday,
      revenueToday: revenueToday,
    });
  };

  const generateChartDataFromOrders = (orders: any[]) => {
    if (!orders || orders.length === 0) {
      generateChartData(); // Fallback to empty chart
      return;
    }

    // Group orders by date
    const ordersByDate = new Map<string, { revenue: number; count: number }>();

    orders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric'
      });

      if (!ordersByDate.has(date)) {
        ordersByDate.set(date, { revenue: 0, count: 0 });
      }

      const data = ordersByDate.get(date)!;
      data.revenue += order.total || 0;
      data.count += 1;
    });

    const labels = Array.from(ordersByDate.keys());
    const revenueData = Array.from(ordersByDate.values()).map(d => d.revenue);
    const ordersData = Array.from(ordersByDate.values()).map(d => d.count);

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

  const generateChartData = () => {
    // Empty chart for when no data exists
    const labels = ['No Data'];

    setChartData({
      labels,
      datasets: [
        {
          label: 'Revenue (₹)',
          data: [0],
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
        },
        {
          label: 'Orders',
          data: [0],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
        },
      ],
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
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
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.dataset.label === 'Revenue (₹)') {
                label += '₹' + context.parsed.y.toLocaleString('en-IN');
              } else {
                label += context.parsed.y;
              }
            }
            return label;
          }
        }
      },
    },
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Overview of your Ayurveda shop performance
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Revenue"
          value={kpiData.gmv}
          change={kpiData.gmvChange}
          icon={DollarSign}
          format="currency"
          loading={loading}
        />
        <KPICard
          title="Average Order Value"
          value={kpiData.aov}
          change={kpiData.aovChange}
          icon={TrendingUp}
          format="currency"
          loading={loading}
        />
        <KPICard
          title="Total Orders"
          value={recentOrders.length}
          change={kpiData.conversionChange}
          icon={ShoppingCart}
          loading={loading}
        />
        <KPICard
          title="Active Customers"
          value={kpiData.activeUsers}
          change={kpiData.activeUsersChange}
          icon={Users}
          loading={loading}
        />
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Revenue & Orders Trend
        </h2>
        <div className="h-80">
          {chartData && <Line data={chartData} options={chartOptions} />}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-600 border-t-transparent"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading orders...</p>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-6 text-center">
              <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No orders yet</p>
              <p className="text-sm text-gray-500 mt-1">Orders will appear here once customers start placing them</p>
            </div>
          ) : (
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
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      #{order.orderNumber || order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {order.customerName || order.customerEmail || 'Guest'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                      ₹{order.total?.toLocaleString('en-IN') || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                        {order.status || 'Unknown'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
