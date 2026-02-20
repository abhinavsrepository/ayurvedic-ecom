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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const query_order_dto_1 = require("./dto/query-order.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let OrdersController = class OrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    findAll(userEmail, roles = [], query) {
        if (this.hasAdminRole(roles)) {
            return this.ordersService.findAllOrders(query);
        }
        return this.ordersService.findUserOrders(userEmail, query);
    }
    searchOrders(query, queryDto) {
        return this.ordersService.searchOrders(query, queryDto);
    }
    export(queryDto) {
        return this.ordersService.export(queryDto);
    }
    create(userEmail, createOrderDto) {
        return this.ordersService.createOrder(userEmail, createOrderDto);
    }
    trackOrder(id, userEmail, roles = []) {
        if (this.hasAdminRole(roles)) {
            return this.ordersService.trackOrder(id);
        }
        return this.ordersService.trackOrder(id, userEmail);
    }
    cancelOrder(id, userEmail, roles = [], reason) {
        if (this.hasAdminRole(roles)) {
            return this.ordersService.cancelOrderAdmin(id, reason);
        }
        return this.ordersService.cancelOrder(id, userEmail, reason);
    }
    updateStatus(id, body) {
        return this.ordersService.updateOrderStatus(id, body);
    }
    refundOrder(id, adminUserId, body) {
        return this.ordersService.processRefund(id, body.amount, body.reason, adminUserId);
    }
    findOne(id, userEmail, roles = []) {
        if (this.hasAdminRole(roles)) {
            return this.ordersService.findOneAdmin(id);
        }
        return this.ordersService.findOne(id, userEmail);
    }
    hasAdminRole(roles) {
        return roles?.includes('admin') || roles?.includes('manager');
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get orders (admin: all, user: own)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orders retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('email')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('roles')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, query_order_dto_1.QueryOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Search orders (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orders found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_order_dto_1.QueryOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "searchOrders", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Export orders to CSV (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Export initiated' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_order_dto_1.QueryOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "export", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new order' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Order created successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid order data or insufficient stock',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('email')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id/track'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order tracking information' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Order ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tracking info retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('email')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('roles')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "trackOrder", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel an order' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Order ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order cancelled successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Cannot cancel order in current status',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('email')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('roles')),
    __param(3, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "cancelOrder", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Update order status (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Order ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order status updated' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/refund'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Refund an order (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Order ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order refunded' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid refund request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "refundOrder", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Order ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('email')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('roles')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findOne", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, common_1.Controller)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map