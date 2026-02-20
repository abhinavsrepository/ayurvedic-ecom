import { Injectable, NotFoundException } from '@nestjs/common';

type BannerPosition = 'hero' | 'middle' | 'footer' | 'popup';
type BannerStatus = 'active' | 'inactive' | 'scheduled';

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundColor?: string;
  textColor?: string;
  position: BannerPosition;
  status: BannerStatus;
  priority: number;
  startDate?: string;
  endDate?: string;
  targetAudience?: 'all' | 'new' | 'returning' | 'vip';
  displayType: 'full-width' | 'centered' | 'sidebar' | 'floating';
  animation?: 'fade' | 'slide' | 'zoom' | 'none';
  clicks: number;
  impressions: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class BannersService {
  private banners: Banner[] = [
    {
      id: 'banner-hero-1',
      title: 'Holistic Wellness, Delivered',
      subtitle: 'Ancient Ayurveda for modern life',
      description: 'Explore trusted formulas crafted from natural ingredients.',
      imageUrl: '/banner/kosmico.jpeg',
      mobileImageUrl: '/banner/kosmico.jpeg',
      ctaText: 'Shop Now',
      ctaLink: '/shop',
      backgroundColor: '#F5F9F2',
      textColor: '#1F2937',
      position: 'hero',
      status: 'active',
      priority: 1,
      targetAudience: 'all',
      displayType: 'full-width',
      animation: 'fade',
      clicks: 0,
      impressions: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'banner-middle-1',
      title: 'Hair Care Essentials',
      subtitle: 'Strengthen naturally',
      imageUrl: '/banner/hairoil.jpeg',
      mobileImageUrl: '/banner/hairoil.jpeg',
      ctaText: 'View Collection',
      ctaLink: '/shop?category=Hair+Care',
      position: 'middle',
      status: 'active',
      priority: 1,
      displayType: 'centered',
      animation: 'slide',
      clicks: 0,
      impressions: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'banner-footer-1',
      title: 'Digestive Health Support',
      subtitle: 'Balanced formulas for daily comfort',
      imageUrl: '/banner/fitliv.jpeg',
      mobileImageUrl: '/banner/fitliv.jpeg',
      ctaText: 'Learn More',
      ctaLink: '/blog',
      position: 'footer',
      status: 'active',
      priority: 1,
      displayType: 'full-width',
      animation: 'none',
      clicks: 0,
      impressions: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'banner-popup-1',
      title: 'First Order Offer',
      subtitle: 'Get 10% off on your first purchase',
      imageUrl: '/banner/activeprotein.jpeg',
      ctaText: 'Claim Offer',
      ctaLink: '/shop',
      position: 'popup',
      status: 'active',
      priority: 1,
      displayType: 'floating',
      animation: 'zoom',
      clicks: 0,
      impressions: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  getBanners(position?: string, status?: string) {
    const now = new Date();

    return this.banners
      .filter((banner) => {
        if (position && banner.position !== position) {
          return false;
        }
        if (status && banner.status !== status) {
          return false;
        }
        if (banner.startDate && new Date(banner.startDate) > now) {
          return false;
        }
        if (banner.endDate && new Date(banner.endDate) < now) {
          return false;
        }
        return true;
      })
      .sort((a, b) => a.priority - b.priority);
  }

  incrementImpression(id: string) {
    const banner = this.findById(id);
    banner.impressions += 1;
    banner.updatedAt = new Date().toISOString();
    return banner;
  }

  incrementClick(id: string) {
    const banner = this.findById(id);
    banner.clicks += 1;
    banner.updatedAt = new Date().toISOString();
    return banner;
  }

  private findById(id: string) {
    const banner = this.banners.find((item) => item.id === id);
    if (!banner) {
      throw new NotFoundException(`Banner with ID '${id}' not found`);
    }
    return banner;
  }
}
