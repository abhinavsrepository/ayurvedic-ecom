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
var CartService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cache_service_1 = require("../cache/cache.service");
const cache_constants_1 = require("../cache/cache.constants");
let CartService = CartService_1 = class CartService {
    prisma;
    cacheService;
    logger = new common_1.Logger(CartService_1.name);
    constructor(prisma, cacheService) {
        this.prisma = prisma;
        this.cacheService = cacheService;
    }
    async getOrCreateCart(userId, sessionId) {
        if (!userId && !sessionId) {
            throw new common_1.BadRequestException('Either userId or sessionId is required');
        }
        let cart = await this.findCart(userId, sessionId);
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: {
                    user_id: userId || null,
                    session_id: sessionId || null,
                    expires_at: userId
                        ? null
                        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
                include: {
                    cart_items: {
                        include: {
                            product: {
                                include: {
                                    product_images: {
                                        where: { is_primary: true },
                                        take: 1,
                                    },
                                },
                            },
                        },
                    },
                },
            });
            this.logger.log(`Created new cart: ${cart.id} for ${userId ? `user ${userId}` : `session ${sessionId}`}`);
        }
        return this.formatCartResponse(cart);
    }
    async findCart(userId, sessionId) {
        const where = {};
        if (userId) {
            where.user_id = userId;
        }
        else if (sessionId) {
            where.session_id = sessionId;
            where.expires_at = { gt: new Date() };
        }
        return this.prisma.cart.findFirst({
            where,
            include: {
                cart_items: {
                    include: {
                        product: {
                            include: {
                                product_images: {
                                    where: { is_primary: true },
                                    take: 1,
                                },
                            },
                        },
                    },
                },
            },
        });
    }
    async getCart(userId, sessionId) {
        const cacheKey = userId
            ? cache_constants_1.CACHE_KEYS.CART_BY_USER(userId)
            : cache_constants_1.CACHE_KEYS.CART_BY_SESSION(sessionId);
        return this.cacheService.wrap(cacheKey, async () => {
            const cart = await this.findCart(userId, sessionId);
            if (!cart) {
                return { items: [], subtotal: 0, itemCount: 0 };
            }
            return this.formatCartResponse(cart);
        }, cache_constants_1.CACHE_TTL.SHORT);
    }
    async addItem(dto, userId, sessionId) {
        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId },
            include: { stock: true },
        });
        if (!product || product.deleted_at) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('Product is not available');
        }
        const stock = product.stock[0];
        if (!stock || stock.quantity < dto.quantity) {
            throw new common_1.BadRequestException('Insufficient stock');
        }
        const cart = await this.getOrCreateCartEntity(userId, sessionId);
        const existingItem = await this.prisma.cartItem.findFirst({
            where: {
                cart_id: cart.id,
                product_id: dto.productId,
                variant_id: dto.variantId || null,
            },
        });
        if (existingItem) {
            const newQuantity = existingItem.quantity + dto.quantity;
            if (stock.quantity < newQuantity) {
                throw new common_1.BadRequestException('Insufficient stock for requested quantity');
            }
            await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: newQuantity,
                    updated_at: new Date(),
                },
            });
        }
        else {
            await this.prisma.cartItem.create({
                data: {
                    cart_id: cart.id,
                    product_id: dto.productId,
                    quantity: dto.quantity,
                    variant_id: dto.variantId || null,
                },
            });
        }
        await this.prisma.cart.update({
            where: { id: cart.id },
            data: { updated_at: new Date() },
        });
        await this.invalidateCartCache(userId, sessionId);
        this.logger.log(`Added item ${dto.productId} to cart ${cart.id}`);
        return this.getCart(userId, sessionId);
    }
    async updateItem(itemId, dto, userId, sessionId) {
        const cart = await this.findCart(userId, sessionId);
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        const item = cart.cart_items.find((i) => i.id === itemId);
        if (!item) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        const product = await this.prisma.product.findUnique({
            where: { id: item.product_id },
            include: { stock: true },
        });
        if (!product ||
            !product.stock[0] ||
            product.stock[0].quantity < dto.quantity) {
            throw new common_1.BadRequestException('Insufficient stock');
        }
        await this.prisma.cartItem.update({
            where: { id: itemId },
            data: {
                quantity: dto.quantity,
                updated_at: new Date(),
            },
        });
        await this.prisma.cart.update({
            where: { id: cart.id },
            data: { updated_at: new Date() },
        });
        await this.invalidateCartCache(userId, sessionId);
        this.logger.log(`Updated cart item ${itemId} quantity to ${dto.quantity}`);
        return this.getCart(userId, sessionId);
    }
    async removeItem(itemId, userId, sessionId) {
        const cart = await this.findCart(userId, sessionId);
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        const item = cart.cart_items.find((i) => i.id === itemId);
        if (!item) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        await this.prisma.cartItem.delete({
            where: { id: itemId },
        });
        await this.prisma.cart.update({
            where: { id: cart.id },
            data: { updated_at: new Date() },
        });
        await this.invalidateCartCache(userId, sessionId);
        this.logger.log(`Removed item ${itemId} from cart ${cart.id}`);
        return this.getCart(userId, sessionId);
    }
    async clearCart(userId, sessionId) {
        const cart = await this.findCart(userId, sessionId);
        if (!cart) {
            return { items: [], subtotal: 0, itemCount: 0 };
        }
        await this.prisma.cartItem.deleteMany({
            where: { cart_id: cart.id },
        });
        await this.prisma.cart.update({
            where: { id: cart.id },
            data: { updated_at: new Date() },
        });
        await this.invalidateCartCache(userId, sessionId);
        this.logger.log(`Cleared cart ${cart.id}`);
        return { items: [], subtotal: 0, itemCount: 0 };
    }
    async mergeCart(dto, userId) {
        const guestCart = await this.findCart(undefined, dto.sessionId);
        if (!guestCart || guestCart.cart_items.length === 0) {
            return this.getCart(userId, undefined);
        }
        let userCart = await this.findCart(userId, undefined);
        if (!userCart) {
            userCart = await this.prisma.cart.create({
                data: { user_id: userId },
                include: {
                    cart_items: {
                        include: {
                            product: {
                                include: {
                                    product_images: {
                                        where: { is_primary: true },
                                        take: 1,
                                    },
                                },
                            },
                        },
                    },
                },
            });
        }
        for (const guestItem of guestCart.cart_items) {
            const existingItem = userCart.cart_items.find((i) => i.product_id === guestItem.product_id &&
                i.variant_id === guestItem.variant_id);
            if (existingItem) {
                const product = await this.prisma.product.findUnique({
                    where: { id: guestItem.product_id },
                    include: { stock: true },
                });
                const maxQty = product?.stock[0]?.quantity || 99;
                const newQty = Math.min(existingItem.quantity + guestItem.quantity, maxQty);
                await this.prisma.cartItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: newQty, updated_at: new Date() },
                });
            }
            else {
                await this.prisma.cartItem.create({
                    data: {
                        cart_id: userCart.id,
                        product_id: guestItem.product_id,
                        quantity: guestItem.quantity,
                        variant_id: guestItem.variant_id,
                    },
                });
            }
        }
        await this.prisma.cart.delete({
            where: { id: guestCart.id },
        });
        await this.invalidateCartCache(userId, undefined);
        await this.invalidateCartCache(undefined, dto.sessionId);
        this.logger.log(`Merged guest cart ${guestCart.id} into user cart ${userCart.id}`);
        return this.getCart(userId, undefined);
    }
    async getCartSummary(userId, sessionId) {
        const cart = await this.getCart(userId, sessionId);
        const subtotal = cart.subtotal || 0;
        const shipping = subtotal > 999 ? 0 : 50;
        const tax = Math.round(subtotal * 0.18);
        const total = subtotal + shipping + tax;
        return {
            subtotal,
            shipping,
            tax,
            total,
            itemCount: cart.itemCount || 0,
            freeShippingThreshold: 999,
            amountToFreeShipping: Math.max(0, 999 - subtotal),
        };
    }
    async getOrCreateCartEntity(userId, sessionId) {
        let cart = await this.prisma.cart.findFirst({
            where: userId ? { user_id: userId } : { session_id: sessionId },
        });
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: {
                    user_id: userId || null,
                    session_id: sessionId || null,
                    expires_at: userId
                        ? null
                        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            });
        }
        return cart;
    }
    formatCartResponse(cart) {
        const items = cart.cart_items.map((item) => ({
            id: item.id,
            productId: item.product_id,
            name: item.product.name,
            slug: item.product.slug,
            price: Number(item.product.price),
            originalPrice: item.product.compare_at_price
                ? Number(item.product.compare_at_price)
                : undefined,
            image: item.product.product_images[0]?.url || '',
            quantity: item.quantity,
            variantId: item.variant_id,
            lineTotal: Number(item.product.price) * item.quantity,
        }));
        const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
        const itemCount = items.reduce((count, item) => count + item.quantity, 0);
        return {
            id: cart.id,
            items,
            subtotal,
            itemCount,
            updatedAt: cart.updated_at,
        };
    }
    async invalidateCartCache(userId, sessionId) {
        const promises = [];
        if (userId) {
            promises.push(this.cacheService.del(cache_constants_1.CACHE_KEYS.CART_BY_USER(userId)));
        }
        if (sessionId) {
            promises.push(this.cacheService.del(cache_constants_1.CACHE_KEYS.CART_BY_SESSION(sessionId)));
        }
        await Promise.all(promises);
    }
};
exports.CartService = CartService;
exports.CartService = CartService = CartService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], CartService);
//# sourceMappingURL=cart.service.js.map