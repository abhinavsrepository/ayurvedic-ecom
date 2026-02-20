export declare enum OrderStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    PROCESSING = "PROCESSING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}
export declare class QueryOrderDto {
    page?: number;
    size?: number;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    fulfillmentStatus?: string;
    fromDate?: string;
    toDate?: string;
    customerEmail?: string;
    q?: string;
}
