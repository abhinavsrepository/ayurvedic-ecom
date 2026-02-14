import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { MergeCartDto } from './dto/merge-cart.dto';
export declare class CartService {
    private prisma;
    private cacheService;
    private readonly logger;
    constructor(prisma: PrismaService, cacheService: CacheService);
    getOrCreateCart(userId?: string, sessionId?: string): Promise<{
        id: any;
        items: any;
        subtotal: any;
        itemCount: any;
        updatedAt: any;
    }>;
    private findCart;
    getCart(userId?: string, sessionId?: string): Promise<{
        id: any;
        items: any;
        subtotal: any;
        itemCount: any;
        updatedAt: any;
    } | {
        items: never[];
        subtotal: number;
        itemCount: number;
    }>;
    addItem(dto: AddCartItemDto, userId?: string, sessionId?: string): Promise<{
        id: any;
        items: any;
        subtotal: any;
        itemCount: any;
        updatedAt: any;
    } | {
        items: never[];
        subtotal: number;
        itemCount: number;
    }>;
    updateItem(itemId: string, dto: UpdateCartItemDto, userId?: string, sessionId?: string): Promise<{
        id: any;
        items: any;
        subtotal: any;
        itemCount: any;
        updatedAt: any;
    } | {
        items: never[];
        subtotal: number;
        itemCount: number;
    }>;
    removeItem(itemId: string, userId?: string, sessionId?: string): Promise<{
        id: any;
        items: any;
        subtotal: any;
        itemCount: any;
        updatedAt: any;
    } | {
        items: never[];
        subtotal: number;
        itemCount: number;
    }>;
    clearCart(userId?: string, sessionId?: string): Promise<{
        items: never[];
        subtotal: number;
        itemCount: number;
    }>;
    mergeCart(dto: MergeCartDto, userId: string): Promise<{
        id: any;
        items: any;
        subtotal: any;
        itemCount: any;
        updatedAt: any;
    } | {
        items: never[];
        subtotal: number;
        itemCount: number;
    }>;
    getCartSummary(userId?: string, sessionId?: string): Promise<{
        subtotal: any;
        shipping: number;
        tax: number;
        total: any;
        itemCount: any;
        freeShippingThreshold: number;
        amountToFreeShipping: number;
    }>;
    private getOrCreateCartEntity;
    private formatCartResponse;
    private invalidateCartCache;
}
