/**
 * Reviews Controller
 *
 * REST API endpoints for product reviews and ratings.
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Public()
  @Get('product/:productId')
  @ApiOperation({ summary: 'Get reviews for a product' })
  @ApiParam({ name: 'productId', description: 'Product ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid product ID format' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductReviews(
    @Param('productId') productId: string,
    @Query() query: QueryReviewDto,
  ) {
    if (!this.isValidUUID(productId)) {
      throw new BadRequestException('Product ID must be a valid UUID');
    }
    return this.reviewsService.getProductReviews(productId, query);
  }

  @Public()
  @Get('product/:productId/stats')
  @ApiOperation({ summary: 'Get rating statistics for a product' })
  @ApiParam({ name: 'productId', description: 'Product ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Rating stats retrieved' })
  @ApiResponse({ status: 400, description: 'Invalid product ID format' })
  async getProductRatingStats(@Param('productId') productId: string) {
    if (!this.isValidUUID(productId)) {
      throw new BadRequestException('Product ID must be a valid UUID');
    }
    return this.reviewsService.getProductRatingStats(productId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a product review' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'Already reviewed this product' })
  async create(
    @Body() dto: CreateReviewDto,
    @CurrentUser('customerId') customerId: string,
  ) {
    return this.reviewsService.create(dto, customerId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update your review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Cannot edit others review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateReviewDto,
    @CurrentUser('customerId') customerId: string,
  ) {
    return this.reviewsService.update(id, dto, customerId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete your review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Cannot delete others review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('customerId') customerId: string,
  ) {
    return this.reviewsService.delete(id, customerId);
  }

  @Post(':id/helpful')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark review as helpful (toggle)' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Helpful status toggled' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async markHelpful(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.reviewsService.markHelpful(id, userId);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get your reviews' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserReviews(@CurrentUser('customerId') customerId: string) {
    return this.reviewsService.getUserReviews(customerId);
  }

  private isValidUUID(value: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }
}
