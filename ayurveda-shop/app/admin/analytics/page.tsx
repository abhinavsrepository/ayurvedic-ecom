'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { BarChart3, ShoppingCart, Users, TrendingUp, Activity } from 'lucide-react';
import { analyticsApi, EventSummaryItem, TrafficSourcesResponse } from '@/lib/api/analytics';
import { toast } from 'sonner';

export default function AnalyticsPage() {
  const [traffic, setTraffic] = useState<TrafficSourcesResponse['summary']>({
    totalVisits: 0,
    totalConversions: 0,
    totalRevenue: 0,
    avgConversionRate: '0.00',
  });
  const [events, setEvents] = useState<EventSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];

        const [trafficResponse, eventsResponse] = await Promise.all([
          analyticsApi.getTrafficSources(startDate, endDate),
          analyticsApi.getEventSummary(startDate, endDate),
        ]);

        setTraffic(trafficResponse.summary);
        setEvents(eventsResponse);
      } catch (error: any) {
        console.error('Failed to load analytics:', error);
        toast.error('Failed to load analytics');
        setTraffic({
          totalVisits: 0,
          totalConversions: 0,
          totalRevenue: 0,
          avgConversionRate: '0.00',
        });
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const totalEvents = events.reduce((sum, event) => sum + event.count, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Overview</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Last 30 days performance and event activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Visits" value={traffic.totalVisits.toLocaleString()} icon={<Users className="w-5 h-5 text-blue-500" />} />
        <StatCard label="Conversions" value={traffic.totalConversions.toLocaleString()} icon={<ShoppingCart className="w-5 h-5 text-green-500" />} />
        <StatCard label="Revenue" value={`Rs.${traffic.totalRevenue.toLocaleString()}`} icon={<TrendingUp className="w-5 h-5 text-purple-500" />} />
        <StatCard label="Tracked Events" value={totalEvents.toLocaleString()} icon={<Activity className="w-5 h-5 text-orange-500" />} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Event Breakdown</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading analytics...</div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No event data available</div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {events.map((event) => (
              <div key={event.eventType} className="px-6 py-4 flex items-center justify-between">
                <span className="text-gray-900 dark:text-white capitalize">{event.eventType.replace(/_/g, ' ')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{event.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Average conversion rate: <span className="font-semibold text-gray-900 dark:text-white">{traffic.avgConversionRate}%</span>
        </p>
      </div>
    </div>
  );
}

function StatCard({
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
