'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Smartphone, Monitor, Tablet, Globe } from 'lucide-react';
import { analyticsApi, DeviceSummary } from '@/lib/api/analytics';
import { toast } from 'sonner';

export default function DeviceAnalyticsPage() {
  const [summary, setSummary] = useState<DeviceSummary>({
    deviceTypes: [],
    browsers: [],
    operatingSystems: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];
        const data = await analyticsApi.getDeviceSummary(startDate, endDate);
        setSummary(data);
      } catch (error: any) {
        console.error('Failed to load device analytics:', error);
        toast.error('Failed to load device analytics');
        setSummary({
          deviceTypes: [],
          browsers: [],
          operatingSystems: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalSessions = useMemo(
    () => summary.deviceTypes.reduce((sum, item) => sum + item.count, 0),
    [summary.deviceTypes],
  );

  const getDeviceIcon = (type: string) => {
    const normalized = (type || '').toLowerCase();
    if (normalized.includes('mobile')) return <Smartphone className="w-4 h-4 text-blue-500" />;
    if (normalized.includes('tablet')) return <Tablet className="w-4 h-4 text-purple-500" />;
    return <Monitor className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Device Analytics</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Last 30 days session distribution by device, browser, and operating system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Metric title="Total Sessions" value={totalSessions.toLocaleString()} icon={<Globe className="w-5 h-5 text-gray-500" />} />
        <Metric
          title="Top Device"
          value={summary.deviceTypes[0]?.type || 'N/A'}
          icon={getDeviceIcon(summary.deviceTypes[0]?.type || '')}
        />
        <Metric
          title="Top Browser"
          value={summary.browsers[0]?.browser || 'N/A'}
          icon={<Globe className="w-5 h-5 text-blue-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SummaryList
          title="Device Types"
          loading={loading}
          items={summary.deviceTypes.map((item) => ({
            label: item.type || 'Unknown',
            value: item.count,
            icon: getDeviceIcon(item.type || ''),
          }))}
        />
        <SummaryList
          title="Browsers"
          loading={loading}
          items={summary.browsers.map((item) => ({
            label: item.browser || 'Unknown',
            value: item.count,
            icon: <Globe className="w-4 h-4 text-blue-500" />,
          }))}
        />
        <SummaryList
          title="Operating Systems"
          loading={loading}
          items={summary.operatingSystems.map((item) => ({
            label: item.os || 'Unknown',
            value: item.count,
            icon: <Monitor className="w-4 h-4 text-green-500" />,
          }))}
        />
      </div>
    </div>
  );
}

function Metric({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

function SummaryList({
  title,
  items,
  loading,
}: {
  title: string;
  items: { label: string; value: number; icon: ReactNode }[];
  loading: boolean;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
      {loading ? (
        <div className="p-6 text-center text-gray-500">Loading...</div>
      ) : items.length === 0 ? (
        <div className="p-6 text-center text-gray-500">No data available</div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {items.map((item) => (
            <div key={`${title}-${item.label}`} className="px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
