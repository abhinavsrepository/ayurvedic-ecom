import type { Banner } from '@/types/banner';

const mapBanner = (banner: any): Banner => ({
  ...banner,
  startDate: banner.startDate ? new Date(banner.startDate) : undefined,
  endDate: banner.endDate ? new Date(banner.endDate) : undefined,
  createdAt: new Date(banner.createdAt),
  updatedAt: new Date(banner.updatedAt),
});

export const bannersApi = {
  getBanners: async (params?: {
    position?: 'hero' | 'middle' | 'footer' | 'popup';
    status?: 'active' | 'inactive' | 'scheduled';
  }): Promise<Banner[]> => {
    const query = new URLSearchParams();
    if (params?.position) query.set('position', params.position);
    if (params?.status) query.set('status', params.status);

    const response = await fetch(`/api/banners${query.toString() ? `?${query}` : ''}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch banners: ${response.status}`);
    }

    const data = await response.json();
    return (data.banners || []).map(mapBanner);
  },

  // Get active banners by position
  getActiveBanners: async (position: 'hero' | 'middle' | 'footer' | 'popup'): Promise<Banner[]> => {
    try {
      return await bannersApi.getBanners({ position, status: 'active' });
    } catch (error) {
      console.error('Error fetching banners:', error);
      return [];
    }
  },

  // Track banner impression
  incrementImpressions: async (bannerId: string): Promise<void> => {
    try {
      await fetch(`/api/banners/${bannerId}/impressions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error tracking banner impression:', error);
    }
  },

  // Track banner click
  incrementClicks: async (bannerId: string): Promise<void> => {
    try {
      await fetch(`/api/banners/${bannerId}/clicks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error tracking banner click:', error);
    }
  },
};
