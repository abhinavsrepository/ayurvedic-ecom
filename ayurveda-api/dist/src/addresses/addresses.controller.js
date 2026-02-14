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
exports.AddressesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const addresses_service_1 = require("./addresses.service");
const create_address_dto_1 = require("./dto/create-address.dto");
const update_address_dto_1 = require("./dto/update-address.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let AddressesController = class AddressesController {
    addressesService;
    constructor(addressesService) {
        this.addressesService = addressesService;
    }
    async findAll(customerId) {
        return this.addressesService.findAll(customerId);
    }
    async getDefault(customerId) {
        return this.addressesService.getDefault(customerId);
    }
    async findOne(id, customerId) {
        return this.addressesService.findOne(id, customerId);
    }
    async create(dto, customerId) {
        return this.addressesService.create(dto, customerId);
    }
    async update(id, dto, customerId) {
        return this.addressesService.update(id, dto, customerId);
    }
    async delete(id, customerId) {
        return this.addressesService.delete(id, customerId);
    }
    async setDefault(id, customerId) {
        return this.addressesService.setDefault(id, customerId);
    }
};
exports.AddressesController = AddressesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all addresses for current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Addresses retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('default'),
    (0, swagger_1.ApiOperation)({ summary: 'Get default address' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Default address retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "getDefault", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get address by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Address ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Address found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Address not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new address' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Address created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_address_dto_1.CreateAddressDto, String]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an address' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Address ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Address updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Address not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_address_dto_1.UpdateAddressDto, String]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an address' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Address ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Address deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Address not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/default'),
    (0, swagger_1.ApiOperation)({ summary: 'Set an address as default' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Address ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Address set as default' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Address not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "setDefault", null);
exports.AddressesController = AddressesController = __decorate([
    (0, swagger_1.ApiTags)('Addresses'),
    (0, common_1.Controller)('addresses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [addresses_service_1.AddressesService])
], AddressesController);
//# sourceMappingURL=addresses.controller.js.map