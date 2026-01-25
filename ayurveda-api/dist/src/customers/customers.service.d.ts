import { PrismaService } from '../prisma/prisma.service';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryCustomerDto): Promise<{
        customers: {
            id: string;
            created_at: Date;
            email: string;
            full_name: string | null;
            updated_at: Date;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        created_at: Date;
        email: string;
        full_name: string | null;
        updated_at: Date;
    }>;
    update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<{
        id: string;
        created_at: Date;
        email: string;
        full_name: string | null;
        updated_at: Date;
    }>;
    getCustomerStats(id: string): Promise<{
        customerId: string;
        totalOrders: number;
        totalSpent: number;
        lastOrderDate: null;
    }>;
}
