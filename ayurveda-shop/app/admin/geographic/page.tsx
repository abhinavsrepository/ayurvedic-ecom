'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { MapPin, Globe } from 'lucide-react';
import { analyticsApi, LocationSummary } from '@/lib/api/analytics';
import { toast } from 'sonner';

export default function GeographicPage() {
  const [summary, setSummary] = useState<LocationSummary>({
    topCountries: [],
    topCities: [],
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
        const data = await analyticsApi.getLocationSummary(startDate, endDate);
        setSummary(data);
      } catch (error: any) {
        console.error('Failed to load location analytics:', error);
        toast.error('Failed to load location analytics');
        setSummary({
          topCountries: [],
          topCities: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalLocations = useMemo(
    () => summary.topCountries.reduce((sum, location) => sum + location.count, 0),
    [summary.topCountries],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Geographic Analytics</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Last 30 days geographic distribution by country and city
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          label="Tracked Location Events"
          value={totalLocations.toLocaleString()}
          icon={<Globe className="w-5 h-5 text-blue-500" />}
        />
        <MetricCard
          label="Top Country"
          value={summary.topCountries[0]?.country || 'N/A'}
          icon={<MapPin className="w-5 h-5 text-green-500" />}
        />
        <MetricCard
          label="Top City"
          value={summary.topCities[0]?.city || 'N/A'}
          icon={<MapPin className="w-5 h-5 text-purple-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LocationList
          title="Top Countries"
          loading={loading}
          items={summary.topCountries.map((item) => ({
            name: item.country || 'Unknown',
            count: item.count,
          }))}
        />
        <LocationList
          title="Top Cities"
          loading={loading}
          items={summary.topCities.map((item) => ({
            name: item.city || 'Unknown',
            count: item.count,
          }))}
        />
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

function LocationList({
  title,
  loading,
  items,
}: {
  title: string;
  loading: boolean;
  items: { name: string; count: number }[];
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
            <div key={`${title}-${item.name}`} className="px-6 py-3 flex items-center justify-between">
              <span className="text-gray-900 dark:text-white">{item.name}</span>
              <span className="font-semibold text-gray-900 dark:text-white">{item.count.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
