'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Image, MousePointerClick, Eye } from 'lucide-react';
import { bannersApi } from '@/lib/api/banners';
import type { Banner } from '@/types/banner';
import { toast } from 'sonner';

type BannerStatusFilter = 'all' | 'active' | 'inactive' | 'scheduled';

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<BannerStatusFilter>('all');

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const data = await bannersApi.getBanners(
          statusFilter === 'all' ? undefined : { status: statusFilter },
        );
        setBanners(data);
      } catch (error: any) {
        console.error('Failed to load banners:', error);
        toast.error('Failed to load banners');
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [statusFilter]);

  const stats = useMemo(() => {
    const active = banners.filter((banner) => banner.status === 'active').length;
    const scheduled = banners.filter((banner) => banner.status === 'scheduled').length;
    const impressions = banners.reduce((sum, banner) => sum + (banner.impressions || 0), 0);
    const clicks = banners.reduce((sum, banner) => sum + (banner.clicks || 0), 0);
    return { active, scheduled, impressions, clicks };
  }, [banners]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Banner Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Review live promotional banners and engagement metrics
          </p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as BannerStatusFilter)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="Total Banners" value={banners.length.toString()} icon={<Image className="w-5 h-5 text-gray-500" />} />
        <MetricCard label="Active" value={stats.active.toString()} icon={<Image className="w-5 h-5 text-green-500" />} />
        <MetricCard label="Scheduled" value={stats.scheduled.toString()} icon={<Image className="w-5 h-5 text-yellow-500" />} />
        <MetricCard label="Total CTR" value={stats.impressions > 0 ? `${((stats.clicks / stats.impressions) * 100).toFixed(2)}%` : '0.00%'} icon={<MousePointerClick className="w-5 h-5 text-blue-500" />} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Banners</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading banners...</div>
        ) : banners.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No banners found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Banner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Impressions</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Clicks</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">CTR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {banners.map((banner) => {
                  const ctr = banner.impressions > 0 ? ((banner.clicks / banner.impressions) * 100).toFixed(2) : '0.00';

                  return (
                    <tr key={banner.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                            {banner.imageUrl ? (
                              <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                            ) : (
                              <Image className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{banner.title}</p>
                            {banner.subtitle && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">{banner.subtitle}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 capitalize text-gray-700 dark:text-gray-300">{banner.position}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          banner.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : banner.status === 'scheduled'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {banner.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-700 dark:text-gray-300">
                        {banner.impressions.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-700 dark:text-gray-300">
                        {banner.clicks.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                        {ctr}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
      <p className="text-xs text-gray-500 mt-1 flex items-center">
        <Eye className="w-3 h-3 mr-1" />
        Live backend data
      </p>
    </div>
  );
}
