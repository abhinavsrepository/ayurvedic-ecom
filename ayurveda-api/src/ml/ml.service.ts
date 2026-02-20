import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AxiosError } from 'axios';

@Injectable()
export class MlService {
  private readonly logger = new Logger(MlService.name);
  private readonly mlServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.mlServiceUrl = this.configService.get<string>(
      'ML_SERVICE_URL',
      'http://ml-service:5000',
    );
  }

  async getRecommendations(customerId: string, numRecommendations: number = 5) {
    const url = `${this.mlServiceUrl}/api/ml/recommendations`;
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(url, { customerId, numRecommendations }).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data || error.message);
            throw new HttpException(
              error.response?.data || 'Failed to get recommendations',
              error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
      );
      return data;
    } catch (error) {
      this.logger.error(`Error fetching recommendations: ${error.message}`);
      throw error;
    }
  }

  async getForecast(productId: string, days: number = 30) {
    const url = `${this.mlServiceUrl}/api/ml/forecast`;
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(url, { productId, days }).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data || error.message);
            throw new HttpException(
              error.response?.data || 'Failed to get forecast',
              error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
      );
      return data;
    } catch (error) {
      this.logger.error(`Error fetching forecast: ${error.message}`);
      throw error;
    }
  }

  async detectAnomalies(metric: string = 'revenue') {
    const url = `${this.mlServiceUrl}/api/ml/anomalies`;
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(url, { params: { metric } }).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data || error.message);
            throw new HttpException(
              error.response?.data || 'Failed to detect anomalies',
              error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
      );
      return data;
    } catch (error) {
      this.logger.error(`Error detecting anomalies: ${error.message}`);
      throw error;
    }
  }

  async predictChurn(customerData: any) {
    const url = `${this.mlServiceUrl}/api/ml/predict/churn`;
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(url, customerData).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data || error.message);
            throw new HttpException(
              error.response?.data || 'Failed to predict churn',
              error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
      );
      return data;
    } catch (error) {
      this.logger.error(`Error predicting churn: ${error.message}`);
      throw error;
    }
  }

  async predictClv(customerData: any) {
    const url = `${this.mlServiceUrl}/api/ml/predict/clv`;
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(url, customerData).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data || error.message);
            throw new HttpException(
              error.response?.data || 'Failed to predict CLV',
              error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
      );
      return data;
    } catch (error) {
      this.logger.error(`Error predicting CLV: ${error.message}`);
      throw error;
    }
  }

  async runPlayground(inputData: any) {
    const url = `${this.mlServiceUrl}/api/ml/playground`;
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(url, inputData).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data || error.message);
            throw new HttpException(
              error.response?.data || 'Failed to run playground prediction',
              error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
      );
      return data;
    } catch (error) {
      this.logger.error(`Error running playground prediction: ${error.message}`);
      throw error;
    }
  }

  async getModelsInfo() {
    const url = `${this.mlServiceUrl}/api/ml/models/info`;
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(url).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data || error.message);
            throw new HttpException(
              error.response?.data || 'Failed to fetch model information',
              error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
      );
      return data;
    } catch (error) {
      this.logger.error(`Error fetching model information: ${error.message}`);
      throw error;
    }
  }
}
