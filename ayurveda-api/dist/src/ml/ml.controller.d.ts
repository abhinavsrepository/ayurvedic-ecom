import { MlService } from './ml.service';
export declare class MlController {
    private readonly mlService;
    constructor(mlService: MlService);
    getRecommendations(body: {
        customerId: string;
        numRecommendations?: number;
    }): Promise<any>;
    getForecast(body: {
        productId: string;
        days?: number;
    }): Promise<any>;
    detectAnomalies(metric: string): Promise<any>;
    predictChurn(customerData: any): Promise<any>;
    predictClv(customerData: any): Promise<any>;
    runPlayground(inputData: any): Promise<any>;
    getModelsInfo(): Promise<any>;
}
