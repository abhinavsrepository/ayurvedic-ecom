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
export declare class BannersService {
    private banners;
    getBanners(position?: string, status?: string): Banner[];
    incrementImpression(id: string): Banner;
    incrementClick(id: string): Banner;
    private findById;
}
export {};
