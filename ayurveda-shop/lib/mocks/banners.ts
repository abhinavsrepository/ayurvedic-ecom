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
  position: 'hero' | 'middle' | 'footer' | 'popup';
  status: 'active' | 'inactive' | 'scheduled';
  priority: number; // Higher number = higher priority
  startDate?: Date;
  endDate?: Date;
  targetAudience?: 'all' | 'new' | 'returning' | 'vip';
  displayType: 'full-width' | 'centered' | 'sidebar' | 'floating';
  animation?: 'fade' | 'slide' | 'zoom' | 'none';
  clicks: number;
  impressions: number;
  createdAt: Date;
  updatedAt: Date;
}

const defaultBanners: Banner[] = [
  {
    id: 'banner-1',
    title: 'Ayurveda Mega Sale',
    subtitle: 'Up to 50% Off on Selected Products',
    description: 'Experience the healing power of nature with our premium Ayurvedic products',
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1920&h=600&fit=crop',
    mobileImageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=768&h=400&fit=crop',
    ctaText: 'Shop Now',
    ctaLink: '/products',
    backgroundColor: '#10b981',
    textColor: '#ffffff',
    position: 'hero',
    status: 'active',
    priority: 100,
    targetAudience: 'all',
    displayType: 'full-width',
    animation: 'fade',
    clicks: 1250,
    impressions: 45000,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: 'banner-2',
    title: 'Free Shipping on Orders Above ₹999',
    subtitle: 'Limited Time Offer',
    imageUrl: 'https://images.unsplash.com/photo-1599459183200-59c7687a0275?w=1920&h=400&fit=crop',
    ctaText: 'Learn More',
    ctaLink: '/shipping-info',
    backgroundColor: '#8b5cf6',
    textColor: '#ffffff',
    position: 'middle',
    status: 'active',
    priority: 80,
    targetAudience: 'all',
    displayType: 'centered',
    animation: 'slide',
    clicks: 890,
    impressions: 32000,
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-08'),
  },
  {
    id: 'banner-3',
    title: 'New Arrivals',
    subtitle: 'Discover Our Latest Herbal Collection',
    description: 'Handpicked herbs and natural remedies for your wellness journey',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1920&h=600&fit=crop',
    ctaText: 'Explore Now',
    ctaLink: '/new-arrivals',
    backgroundColor: '#f59e0b',
    textColor: '#1f2937',
    position: 'hero',
    status: 'active',
    priority: 90,
    startDate: new Date('2025-01-15'),
    targetAudience: 'all',
    displayType: 'full-width',
    animation: 'zoom',
    clicks: 1450,
    impressions: 52000,
    createdAt: new Date('2025-01-12'),
    updatedAt: new Date('2025-01-14'),
  },
  {
    id: 'banner-4',
    title: 'VIP Members Get 20% Extra Off',
    subtitle: 'Exclusive Benefits for Our Loyal Customers',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
    ctaText: 'Join VIP Club',
    ctaLink: '/membership',
    backgroundColor: '#dc2626',
    textColor: '#ffffff',
    position: 'popup',
    status: 'active',
    priority: 70,
    targetAudience: 'returning',
    displayType: 'floating',
    animation: 'fade',
    clicks: 320,
    impressions: 15000,
    createdAt: new Date('2025-01-08'),
    updatedAt: new Date('2025-01-11'),
  },
  {
    id: 'banner-5',
    title: 'Summer Wellness Package',
    subtitle: 'Beat the Heat with Cooling Herbs',
    description: 'Curated selection of cooling Ayurvedic products for summer',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1920&h=500&fit=crop',
    ctaText: 'View Package',
    ctaLink: '/summer-wellness',
    backgroundColor: '#3b82f6',
    textColor: '#ffffff',
    position: 'middle',
    status: 'scheduled',
    priority: 85,
    startDate: new Date('2025-04-01'),
    endDate: new Date('2025-06-30'),
    targetAudience: 'all',
    displayType: 'centered',
    animation: 'slide',
    clicks: 0,
    impressions: 0,
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: 'banner-6',
    title: 'Subscribe to Our Newsletter',
    subtitle: 'Get 10% Off Your First Order',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&h=400&fit=crop',
    ctaText: 'Subscribe',
    ctaLink: '/newsletter',
    backgroundColor: '#14b8a6',
    textColor: '#ffffff',
    position: 'footer',
    status: 'active',
    priority: 60,
    targetAudience: 'new',
    displayType: 'full-width',
    animation: 'none',
    clicks: 580,
    impressions: 28000,
    createdAt: new Date('2025-01-03'),
    updatedAt: new Date('2025-01-09'),
  },
];

export function getMockBanners(): Banner[] {
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('ayurveda_banners');
    if (cached) {
      const parsed = JSON.parse(cached);
      return parsed.map((banner: any) => ({
        ...banner,
        createdAt: new Date(banner.createdAt),
        updatedAt: new Date(banner.updatedAt),
        startDate: banner.startDate ? new Date(banner.startDate) : undefined,
        endDate: banner.endDate ? new Date(banner.endDate) : undefined,
      }));
    }
    localStorage.setItem('ayurveda_banners', JSON.stringify(defaultBanners));
  }
  return defaultBanners;
}

export function getActiveBanners(position?: 'hero' | 'middle' | 'footer' | 'popup'): Banner[] {
  const banners = getMockBanners();
  const now = new Date();

  return banners
    .filter((banner) => {
      // Must be active
      if (banner.status !== 'active') return false;

      // Check position if specified
      if (position && banner.position !== position) return false;

      // Check date range if specified
      if (banner.startDate && banner.startDate > now) return false;
      if (banner.endDate && banner.endDate < now) return false;

      return true;
    })
    .sort((a, b) => b.priority - a.priority);
}

export function saveBanner(banner: Banner): void {
  if (typeof window !== 'undefined') {
    const banners = getMockBanners();
    const index = banners.findIndex((b) => b.id === banner.id);

    if (index !== -1) {
      banners[index] = { ...banner, updatedAt: new Date() };
    } else {
      banners.push({ ...banner, createdAt: new Date(), updatedAt: new Date() });
    }

    localStorage.setItem('ayurveda_banners', JSON.stringify(banners));
  }
}

export function deleteBanner(bannerId: string): void {
  if (typeof window !== 'undefined') {
    const banners = getMockBanners();
    const filtered = banners.filter((b) => b.id !== bannerId);
    localStorage.setItem('ayurveda_banners', JSON.stringify(filtered));
  }
}

export function incrementBannerImpressions(bannerId: string): void {
  if (typeof window !== 'undefined') {
    const banners = getMockBanners();
    const banner = banners.find((b) => b.id === bannerId);
    if (banner) {
      banner.impressions++;
      localStorage.setItem('ayurveda_banners', JSON.stringify(banners));
    }
  }
}

export function incrementBannerClicks(bannerId: string): void {
  if (typeof window !== 'undefined') {
    const banners = getMockBanners();
    const banner = banners.find((b) => b.id === bannerId);
    if (banner) {
      banner.clicks++;
      localStorage.setItem('ayurveda_banners', JSON.stringify(banners));
    }
  }
}
