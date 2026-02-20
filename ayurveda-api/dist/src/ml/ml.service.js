"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MlService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MlService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let MlService = MlService_1 = class MlService {
    httpService;
    configService;
    logger = new common_1.Logger(MlService_1.name);
    mlServiceUrl;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.mlServiceUrl = this.configService.get('ML_SERVICE_URL', 'http://ml-service:5000');
    }
    async getRecommendations(customerId, numRecommendations = 5) {
        const url = `${this.mlServiceUrl}/api/ml/recommendations`;
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, { customerId, numRecommendations }).pipe((0, operators_1.catchError)((error) => {
                this.logger.error(error.response?.data || error.message);
                throw new common_1.HttpException(error.response?.data || 'Failed to get recommendations', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            })));
            return data;
        }
        catch (error) {
            this.logger.error(`Error fetching recommendations: ${error.message}`);
            throw error;
        }
    }
    async getForecast(productId, days = 30) {
        const url = `${this.mlServiceUrl}/api/ml/forecast`;
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, { productId, days }).pipe((0, operators_1.catchError)((error) => {
                this.logger.error(error.response?.data || error.message);
                throw new common_1.HttpException(error.response?.data || 'Failed to get forecast', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            })));
            return data;
        }
        catch (error) {
            this.logger.error(`Error fetching forecast: ${error.message}`);
            throw error;
        }
    }
    async detectAnomalies(metric = 'revenue') {
        const url = `${this.mlServiceUrl}/api/ml/anomalies`;
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, { params: { metric } }).pipe((0, operators_1.catchError)((error) => {
                this.logger.error(error.response?.data || error.message);
                throw new common_1.HttpException(error.response?.data || 'Failed to detect anomalies', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            })));
            return data;
        }
        catch (error) {
            this.logger.error(`Error detecting anomalies: ${error.message}`);
            throw error;
        }
    }
    async predictChurn(customerData) {
        const url = `${this.mlServiceUrl}/api/ml/predict/churn`;
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, customerData).pipe((0, operators_1.catchError)((error) => {
                this.logger.error(error.response?.data || error.message);
                throw new common_1.HttpException(error.response?.data || 'Failed to predict churn', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            })));
            return data;
        }
        catch (error) {
            this.logger.error(`Error predicting churn: ${error.message}`);
            throw error;
        }
    }
    async predictClv(customerData) {
        const url = `${this.mlServiceUrl}/api/ml/predict/clv`;
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, customerData).pipe((0, operators_1.catchError)((error) => {
                this.logger.error(error.response?.data || error.message);
                throw new common_1.HttpException(error.response?.data || 'Failed to predict CLV', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            })));
            return data;
        }
        catch (error) {
            this.logger.error(`Error predicting CLV: ${error.message}`);
            throw error;
        }
    }
    async runPlayground(inputData) {
        const url = `${this.mlServiceUrl}/api/ml/playground`;
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, inputData).pipe((0, operators_1.catchError)((error) => {
                this.logger.error(error.response?.data || error.message);
                throw new common_1.HttpException(error.response?.data || 'Failed to run playground prediction', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            })));
            return data;
        }
        catch (error) {
            this.logger.error(`Error running playground prediction: ${error.message}`);
            throw error;
        }
    }
    async getModelsInfo() {
        const url = `${this.mlServiceUrl}/api/ml/models/info`;
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url).pipe((0, operators_1.catchError)((error) => {
                this.logger.error(error.response?.data || error.message);
                throw new common_1.HttpException(error.response?.data || 'Failed to fetch model information', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            })));
            return data;
        }
        catch (error) {
            this.logger.error(`Error fetching model information: ${error.message}`);
            throw error;
        }
    }
};
exports.MlService = MlService;
exports.MlService = MlService = MlService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], MlService);
//# sourceMappingURL=ml.service.js.map