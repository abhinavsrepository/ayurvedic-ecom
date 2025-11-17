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
  priority: number;
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
