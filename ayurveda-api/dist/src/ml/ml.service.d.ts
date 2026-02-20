import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class MlService {
    private readonly httpService;
    private readonly configService;
    private readonly logger;
    private readonly mlServiceUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    getRecommendations(customerId: string, numRecommendations?: number): Promise<any>;
    getForecast(productId: string, days?: number): Promise<any>;
    detectAnomalies(metric?: string): Promise<any>;
    predictChurn(customerData: any): Promise<any>;
    predictClv(customerData: any): Promise<any>;
    runPlayground(inputData: any): Promise<any>;
    getModelsInfo(): Promise<any>;
}
