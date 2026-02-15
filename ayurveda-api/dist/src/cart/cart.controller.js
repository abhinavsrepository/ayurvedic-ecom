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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cart_service_1 = require("./cart.service");
const add_cart_item_dto_1 = require("./dto/add-cart-item.dto");
const update_cart_item_dto_1 = require("./dto/update-cart-item.dto");
const merge_cart_dto_1 = require("./dto/merge-cart.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const public_decorator_1 = require("../common/decorators/public.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let CartController = class CartController {
    cartService;
    constructor(cartService) {
        this.cartService = cartService;
    }
    async getCart(userId, sessionId) {
        return this.cartService.getCart(userId, sessionId);
    }
    async addItem(dto, userId, sessionId) {
        return this.cartService.addItem(dto, userId, sessionId);
    }
    async updateItem(itemId, dto, userId, sessionId) {
        return this.cartService.updateItem(itemId, dto, userId, sessionId);
    }
    async removeItem(itemId, userId, sessionId) {
        return this.cartService.removeItem(itemId, userId, sessionId);
    }
    async clearCart(userId, sessionId) {
        return this.cartService.clearCart(userId, sessionId);
    }
    async mergeCart(dto, userId) {
        return this.cartService.mergeCart(dto, userId);
    }
    async getCartSummary(userId, sessionId) {
        return this.cartService.getCartSummary(userId, sessionId);
    }
};
exports.CartController = CartController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current cart' }),
    (0, swagger_1.ApiHeader)({
        name: 'x-session-id',
        required: false,
        description: 'Session ID for guest cart',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cart retrieved successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Headers)('x-session-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getCart", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('items'),
    (0, swagger_1.ApiOperation)({ summary: 'Add item to cart' }),
    (0, swagger_1.ApiHeader)({
        name: 'x-session-id',
        required: false,
        description: 'Session ID for guest cart',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Item added successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid request or insufficient stock',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(2, (0, common_1.Headers)('x-session-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_cart_item_dto_1.AddCartItemDto, Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addItem", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Patch)('items/:itemId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update cart item quantity' }),
    (0, swagger_1.ApiParam)({ name: 'itemId', description: 'Cart item ID' }),
    (0, swagger_1.ApiHeader)({
        name: 'x-session-id',
        required: false,
        description: 'Session ID for guest cart',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Insufficient stock' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cart or item not found' }),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(3, (0, common_1.Headers)('x-session-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_cart_item_dto_1.UpdateCartItemDto, Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "updateItem", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Delete)('items/:itemId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove item from cart' }),
    (0, swagger_1.ApiParam)({ name: 'itemId', description: 'Cart item ID' }),
    (0, swagger_1.ApiHeader)({
        name: 'x-session-id',
        required: false,
        description: 'Session ID for guest cart',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item removed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cart or item not found' }),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(2, (0, common_1.Headers)('x-session-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "removeItem", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Delete)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Clear entire cart' }),
    (0, swagger_1.ApiHeader)({
        name: 'x-session-id',
        required: false,
        description: 'Session ID for guest cart',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cart cleared successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Headers)('x-session-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "clearCart", null);
__decorate([
    (0, common_1.Post)('merge'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Merge guest cart into user cart after login' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Carts merged successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [merge_cart_dto_1.MergeCartDto, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "mergeCart", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cart summary with totals' }),
    (0, swagger_1.ApiHeader)({
        name: 'x-session-id',
        required: false,
        description: 'Session ID for guest cart',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cart summary retrieved' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Headers)('x-session-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getCartSummary", null);
exports.CartController = CartController = __decorate([
    (0, swagger_1.ApiTags)('Cart'),
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map