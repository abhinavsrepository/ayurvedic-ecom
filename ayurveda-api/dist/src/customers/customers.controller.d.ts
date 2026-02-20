import { CustomersService } from './customers.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    findAll(query: QueryCustomerDto): Promise<{
        content: {
            id: string;
            email: string;
            phone_number: string | null;
            created_at: Date;
            updated_at: Date;
            first_name: string;
            last_name: string;
            total_orders: number | null;
            total_spent: import("@prisma/client-runtime-utils").Decimal | null;
            lifetime_value: import("@prisma/client-runtime-utils").Decimal | null;
            average_order_value: import("@prisma/client-runtime-utils").Decimal | null;
            last_order_at: Date | null;
            accepts_marketing: boolean | null;
        }[];
        total: number;
        page: number;
        size: number;
        totalPages: number;
    }>;
    search(query: string, queryDto: QueryCustomerDto): Promise<{
        content: {
            id: string;
            email: string;
            phone_number: string | null;
            created_at: Date;
            first_name: string;
            last_name: string;
            total_orders: number | null;
            total_spent: import("@prisma/client-runtime-utils").Decimal | null;
            lifetime_value: import("@prisma/client-runtime-utils").Decimal | null;
            average_order_value: import("@prisma/client-runtime-utils").Decimal | null;
            last_order_at: Date | null;
        }[];
        total: number;
        page: number;
        size: number;
        totalPages: number;
    }>;
    export(queryDto: QueryCustomerDto): Promise<{
        id: string;
        email: string;
        phone_number: string | null;
        created_at: Date;
        first_name: string;
        last_name: string;
        total_orders: number | null;
        total_spent: import("@prisma/client-runtime-utils").Decimal | null;
        lifetime_value: import("@prisma/client-runtime-utils").Decimal | null;
        average_order_value: import("@prisma/client-runtime-utils").Decimal | null;
        last_order_at: Date | null;
    }[]>;
    findOne(id: string): Promise<{
        orders: {
            id: string;
            created_at: Date;
            status: string;
            total: import("@prisma/client-runtime-utils").Decimal;
            order_number: string;
            payment_status: string;
        }[];
    } & {
        id: string;
        email: string;
        phone_number: string | null;
        created_at: Date;
        updated_at: Date;
        version: bigint | null;
        deleted_at: Date | null;
        notes: string | null;
        first_name: string;
        last_name: string;
        total_orders: number | null;
        total_spent: import("@prisma/client-runtime-utils").Decimal | null;
        lifetime_value: import("@prisma/client-runtime-utils").Decimal | null;
        average_order_value: import("@prisma/client-runtime-utils").Decimal | null;
        last_order_at: Date | null;
        address_line1: string | null;
        address_line2: string | null;
        city: string | null;
        state: string | null;
        postal_code: string | null;
        country: string | null;
        billing_address_line1: string | null;
        billing_address_line2: string | null;
        billing_city: string | null;
        billing_state: string | null;
        billing_postal_code: string | null;
        billing_country: string | null;
        accepts_marketing: boolean | null;
    }>;
    update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<{
        id: string;
        email: string;
        phone_number: string | null;
        created_at: Date;
        updated_at: Date;
        version: bigint | null;
        deleted_at: Date | null;
        notes: string | null;
        first_name: string;
        last_name: string;
        total_orders: number | null;
        total_spent: import("@prisma/client-runtime-utils").Decimal | null;
        lifetime_value: import("@prisma/client-runtime-utils").Decimal | null;
        average_order_value: import("@prisma/client-runtime-utils").Decimal | null;
        last_order_at: Date | null;
        address_line1: string | null;
        address_line2: string | null;
        city: string | null;
        state: string | null;
        postal_code: string | null;
        country: string | null;
        billing_address_line1: string | null;
        billing_address_line2: string | null;
        billing_city: string | null;
        billing_state: string | null;
        billing_postal_code: string | null;
        billing_country: string | null;
        accepts_marketing: boolean | null;
    }>;
    getStats(id: string): Promise<{
        customer: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phoneNumber: string | null;
        };
        stats: {
            totalOrders: number;
            totalSpent: number | import("@prisma/client-runtime-utils").Decimal;
            averageOrderValue: number | import("@prisma/client-runtime-utils").Decimal;
            lifetimeValue: number | import("@prisma/client-runtime-utils").Decimal;
            lastOrderAt: Date | null;
        };
        recentOrders: {
            id: string;
            created_at: Date;
            status: string;
            total: import("@prisma/client-runtime-utils").Decimal;
            order_number: string;
        }[];
    }>;
}
