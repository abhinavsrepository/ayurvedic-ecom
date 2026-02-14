import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { MergeCartDto } from './dto/merge-cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(userId: string | undefined, sessionId: string | undefined): Promise<{
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
    addItem(dto: AddCartItemDto, userId: string | undefined, sessionId: string | undefined): Promise<{
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
    updateItem(itemId: string, dto: UpdateCartItemDto, userId: string | undefined, sessionId: string | undefined): Promise<{
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
    removeItem(itemId: string, userId: string | undefined, sessionId: string | undefined): Promise<{
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
    clearCart(userId: string | undefined, sessionId: string | undefined): Promise<{
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
    getCartSummary(userId: string | undefined, sessionId: string | undefined): Promise<{
        subtotal: any;
        shipping: number;
        tax: number;
        total: any;
        itemCount: any;
        freeShippingThreshold: number;
        amountToFreeShipping: number;
    }>;
}
