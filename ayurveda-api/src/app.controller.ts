import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('actuator/health')
  async getHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'UP', database: 'connected' };
    } catch (error) {
      return { status: 'DOWN', database: 'disconnected' };
    }
  }

  @Get('api/products')
  async getProducts() {
    const products = await this.prisma.product.findMany({
      take: 20,
      orderBy: { created_at: 'desc' },
    });
    return {
      success: true,
      content: products,
      totalElements: products.length,
      message: 'Products loaded from NestJS + Prisma',
    };
  }
}
