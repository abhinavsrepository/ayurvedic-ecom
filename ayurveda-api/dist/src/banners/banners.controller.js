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
exports.BannersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../common/decorators/public.decorator");
const banners_service_1 = require("./banners.service");
let BannersController = class BannersController {
    bannersService;
    constructor(bannersService) {
        this.bannersService = bannersService;
    }
    getBanners(position, status) {
        const banners = this.bannersService.getBanners(position, status);
        return {
            success: true,
            banners,
        };
    }
    trackImpression(id) {
        const banner = this.bannersService.incrementImpression(id);
        return {
            success: true,
            bannerId: id,
            impressions: banner.impressions,
        };
    }
    trackClick(id) {
        const banner = this.bannersService.incrementClick(id);
        return {
            success: true,
            bannerId: id,
            clicks: banner.clicks,
        };
    }
};
exports.BannersController = BannersController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get banners by filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Banners retrieved successfully' }),
    __param(0, (0, common_1.Query)('position')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BannersController.prototype, "getBanners", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(':id/impressions'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Track banner impression' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Impression tracked successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BannersController.prototype, "trackImpression", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(':id/clicks'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Track banner click' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Click tracked successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BannersController.prototype, "trackClick", null);
exports.BannersController = BannersController = __decorate([
    (0, swagger_1.ApiTags)('Banners'),
    (0, common_1.Controller)('banners'),
    __metadata("design:paramtypes", [banners_service_1.BannersService])
], BannersController);
//# sourceMappingURL=banners.controller.js.map