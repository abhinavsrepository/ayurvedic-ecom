import { Controller, Get, Post, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { BannersService, Banner } from './banners.service';

@ApiTags('Banners')
@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get banners by filters' })
  @ApiResponse({ status: 200, description: 'Banners retrieved successfully' })
  getBanners(
    @Query('position') position?: 'hero' | 'middle' | 'footer' | 'popup',
    @Query('status') status?: 'active' | 'inactive' | 'scheduled',
  ) {
    const banners = this.bannersService.getBanners(position, status);
    return {
      success: true,
      banners,
    };
  }

  @Public()
  @Post(':id/impressions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Track banner impression' })
  @ApiResponse({ status: 200, description: 'Impression tracked successfully' })
  trackImpression(@Param('id') id: string) {
    const banner = this.bannersService.incrementImpression(id);
    return {
      success: true,
      bannerId: id,
      impressions: banner.impressions,
    };
  }

  @Public()
  @Post(':id/clicks')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Track banner click' })
  @ApiResponse({ status: 200, description: 'Click tracked successfully' })
  trackClick(@Param('id') id: string) {
    const banner = this.bannersService.incrementClick(id);
    return {
      success: true,
      bannerId: id,
      clicks: banner.clicks,
    };
  }
}
