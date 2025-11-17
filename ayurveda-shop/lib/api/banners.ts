import type { Banner } from '@/types/banner';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const bannersApi = {
  // Get active banners by position
  getActiveBanners: async (position: 'hero' | 'middle' | 'footer' | 'popup'): Promise<Banner[]> => {
    try {
      const response = await fetch(`/api/banners?position=${position}&status=active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch banners: ${response.status}`);
      }

      const data = await response.json();
      return data.banners || [];
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
