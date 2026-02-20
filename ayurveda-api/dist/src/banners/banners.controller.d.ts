import { BannersService, Banner } from './banners.service';
export declare class BannersController {
    private readonly bannersService;
    constructor(bannersService: BannersService);
    getBanners(position?: 'hero' | 'middle' | 'footer' | 'popup', status?: 'active' | 'inactive' | 'scheduled'): {
        success: boolean;
        banners: Banner[];
    };
    trackImpression(id: string): {
        success: boolean;
        bannerId: string;
        impressions: number;
    };
    trackClick(id: string): {
        success: boolean;
        bannerId: string;
        clicks: number;
    };
}
