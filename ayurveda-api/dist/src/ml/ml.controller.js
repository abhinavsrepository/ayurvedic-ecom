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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MlController = void 0;
const common_1 = require("@nestjs/common");
const ml_service_1 = require("./ml.service");
let MlController = class MlController {
    mlService;
    constructor(mlService) {
        this.mlService = mlService;
    }
    async getRecommendations(body) {
        return this.mlService.getRecommendations(body.customerId, body.numRecommendations);
    }
    async getForecast(body) {
        return this.mlService.getForecast(body.productId, body.days);
    }
    async detectAnomalies(metric) {
        return this.mlService.detectAnomalies(metric);
    }
    async predictChurn(customerData) {
        return this.mlService.predictChurn(customerData);
    }
    async predictClv(customerData) {
        return this.mlService.predictClv(customerData);
    }
    async runPlayground(inputData) {
        return this.mlService.runPlayground(inputData);
    }
    async getModelsInfo() {
        return this.mlService.getModelsInfo();
    }
};
exports.MlController = MlController;
__decorate([
    (0, common_1.Post)('recommendations'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MlController.prototype, "getRecommendations", null);
__decorate([
    (0, common_1.Post)('forecast'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MlController.prototype, "getForecast", null);
__decorate([
    (0, common_1.Get)('anomalies'),
    __param(0, (0, common_1.Query)('metric')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MlController.prototype, "detectAnomalies", null);
__decorate([
    (0, common_1.Post)('predict/churn'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MlController.prototype, "predictChurn", null);
__decorate([
    (0, common_1.Post)('predict/clv'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MlController.prototype, "predictClv", null);
__decorate([
    (0, common_1.Post)('playground'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MlController.prototype, "runPlayground", null);
__decorate([
    (0, common_1.Get)('models/info'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MlController.prototype, "getModelsInfo", null);
exports.MlController = MlController = __decorate([
    (0, common_1.Controller)('ml'),
    __metadata("design:paramtypes", [ml_service_1.MlService])
], MlController);
//# sourceMappingURL=ml.controller.js.map