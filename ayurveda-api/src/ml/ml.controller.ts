import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { MlService } from './ml.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Uncomment when auth is ready
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../common/decorators/roles.decorator';

@Controller('ml')
// @UseGuards(JwtAuthGuard) // Protect all ML endpoints
export class MlController {
  constructor(private readonly mlService: MlService) {}

  @Post('recommendations')
  async getRecommendations(
    @Body() body: { customerId: string; numRecommendations?: number },
  ) {
    return this.mlService.getRecommendations(
      body.customerId,
      body.numRecommendations,
    );
  }

  @Post('forecast')
  // @UseGuards(RolesGuard)
  // @Roles('ADMIN')
  async getForecast(@Body() body: { productId: string; days?: number }) {
    return this.mlService.getForecast(body.productId, body.days);
  }

  @Get('anomalies')
  // @UseGuards(RolesGuard)
  // @Roles('ADMIN')
  async detectAnomalies(@Query('metric') metric: string) {
    return this.mlService.detectAnomalies(metric);
  }

  @Post('predict/churn')
  // @UseGuards(RolesGuard)
  // @Roles('ADMIN')
  async predictChurn(@Body() customerData: any) {
    return this.mlService.predictChurn(customerData);
  }

  @Post('predict/clv')
  // @UseGuards(RolesGuard)
  // @Roles('ADMIN')
  async predictClv(@Body() customerData: any) {
    return this.mlService.predictClv(customerData);
  }

  @Post('playground')
  async runPlayground(@Body() inputData: any) {
    return this.mlService.runPlayground(inputData);
  }

  @Get('models/info')
  async getModelsInfo() {
    return this.mlService.getModelsInfo();
  }
}
