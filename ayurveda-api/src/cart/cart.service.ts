/**
 * Cart Service
 *
 * Business logic for cart operations supporting both guest and authenticated users.
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CACHE_KEYS, CACHE_TTL } from '../cache/cache.constants';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { MergeCartDto } from './dto/merge-cart.dto';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  /**
   * Get or create cart for user/session
   */
  async getOrCreateCart(userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
      throw new BadRequestException('Either userId or sessionId is required');
    }

    // Try to find existing cart
    let cart = await this.findCart(userId, sessionId);

    if (!cart) {
      // Create new cart
      cart = await this.prisma.cart.create({
        data: {
          user_id: userId || null,
          session_id: sessionId || null,
          expires_at: userId
            ? null
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days for guest
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
      this.logger.log(
        `Created new cart: ${cart.id} for ${userId ? `user ${userId}` : `session ${sessionId}`}`,
      );
    }

    return this.formatCartResponse(cart);
  }

  /**
   * Find cart by user ID or session ID
   */
  private async findCart(userId?: string, sessionId?: string) {
    const where: any = {};

    if (userId) {
      where.user_id = userId;
    } else if (sessionId) {
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

  /**
   * Get current cart
   */
  async getCart(userId?: string, sessionId?: string) {
    const cacheKey = userId
      ? CACHE_KEYS.CART_BY_USER(userId)
      : CACHE_KEYS.CART_BY_SESSION(sessionId!);

    return this.cacheService.wrap(
      cacheKey,
      async () => {
        const cart = await this.findCart(userId, sessionId);
        if (!cart) {
          return { items: [], subtotal: 0, itemCount: 0 };
        }
        return this.formatCartResponse(cart);
      },
      CACHE_TTL.SHORT,
    );
  }

  /**
   * Add item to cart
   */
  async addItem(dto: AddCartItemDto, userId?: string, sessionId?: string) {
    // Validate product exists and is available
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      include: { stock: true },
    });

    if (!product || product.deleted_at) {
      throw new NotFoundException('Product not found');
    }

    if (product.status !== 'ACTIVE') {
      throw new BadRequestException('Product is not available');
    }

    // Check stock
    const stock = product.stock[0];
    if (!stock || stock.quantity < dto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // Get or create cart
    const cart = await this.getOrCreateCartEntity(userId, sessionId);

    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cart_id: cart.id,
        product_id: dto.productId,
        variant_id: dto.variantId || null,
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + dto.quantity;
      if (stock.quantity < newQuantity) {
        throw new BadRequestException(
          'Insufficient stock for requested quantity',
        );
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: newQuantity,
          updated_at: new Date(),
        },
      });
    } else {
      // Add new item
      await this.prisma.cartItem.create({
        data: {
          cart_id: cart.id,
          product_id: dto.productId,
          quantity: dto.quantity,
          variant_id: dto.variantId || null,
        },
      });
    }

    // Update cart timestamp
    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { updated_at: new Date() },
    });

    // Invalidate cache
    await this.invalidateCartCache(userId, sessionId);

    this.logger.log(`Added item ${dto.productId} to cart ${cart.id}`);
    return this.getCart(userId, sessionId);
  }

  /**
   * Update item quantity
   */
  async updateItem(
    itemId: string,
    dto: UpdateCartItemDto,
    userId?: string,
    sessionId?: string,
  ) {
    const cart = await this.findCart(userId, sessionId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const item = cart.cart_items.find((i) => i.id === itemId);
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    // Check stock
    const product = await this.prisma.product.findUnique({
      where: { id: item.product_id },
      include: { stock: true },
    });

    if (
      !product ||
      !product.stock[0] ||
      product.stock[0].quantity < dto.quantity
    ) {
      throw new BadRequestException('Insufficient stock');
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

  /**
   * Remove item from cart
   */
  async removeItem(itemId: string, userId?: string, sessionId?: string) {
    const cart = await this.findCart(userId, sessionId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const item = cart.cart_items.find((i) => i.id === itemId);
    if (!item) {
      throw new NotFoundException('Cart item not found');
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

  /**
   * Clear entire cart
   */
  async clearCart(userId?: string, sessionId?: string) {
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

  /**
   * Merge guest cart into user cart after login
   */
  async mergeCart(dto: MergeCartDto, userId: string) {
    const guestCart = await this.findCart(undefined, dto.sessionId);
    if (!guestCart || guestCart.cart_items.length === 0) {
      return this.getCart(userId, undefined);
    }

    // Get or create user cart
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

    // Merge items
    for (const guestItem of guestCart.cart_items) {
      const existingItem = userCart.cart_items.find(
        (i) =>
          i.product_id === guestItem.product_id &&
          i.variant_id === guestItem.variant_id,
      );

      if (existingItem) {
        // Add quantities (capped at stock)
        const product = await this.prisma.product.findUnique({
          where: { id: guestItem.product_id },
          include: { stock: true },
        });
        const maxQty = product?.stock[0]?.quantity || 99;
        const newQty = Math.min(
          existingItem.quantity + guestItem.quantity,
          maxQty,
        );

        await this.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQty, updated_at: new Date() },
        });
      } else {
        // Add new item to user cart
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

    // Delete guest cart
    await this.prisma.cart.delete({
      where: { id: guestCart.id },
    });

    // Invalidate caches
    await this.invalidateCartCache(userId, undefined);
    await this.invalidateCartCache(undefined, dto.sessionId);

    this.logger.log(
      `Merged guest cart ${guestCart.id} into user cart ${userCart.id}`,
    );
    return this.getCart(userId, undefined);
  }

  /**
   * Get cart summary (totals)
   */
  async getCartSummary(userId?: string, sessionId?: string) {
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

  /**
   * Get or create cart entity (without formatting)
   */
  private async getOrCreateCartEntity(userId?: string, sessionId?: string) {
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

  /**
   * Format cart response
   */
  private formatCartResponse(cart: any) {
    const items = cart.cart_items.map((item: any) => ({
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

    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.lineTotal,
      0,
    );
    const itemCount = items.reduce(
      (count: number, item: any) => count + item.quantity,
      0,
    );

    return {
      id: cart.id,
      items,
      subtotal,
      itemCount,
      updatedAt: cart.updated_at,
    };
  }

  /**
   * Invalidate cart cache
   */
  private async invalidateCartCache(userId?: string, sessionId?: string) {
    const promises: Promise<void>[] = [];

    if (userId) {
      promises.push(this.cacheService.del(CACHE_KEYS.CART_BY_USER(userId)));
    }
    if (sessionId) {
      promises.push(
        this.cacheService.del(CACHE_KEYS.CART_BY_SESSION(sessionId)),
      );
    }

    await Promise.all(promises);
  }
}
