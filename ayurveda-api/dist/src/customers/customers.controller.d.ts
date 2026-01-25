import { CustomersService } from './customers.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
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
    getStats(id: string): Promise<{
        customerId: string;
        totalOrders: number;
        totalSpent: number;
        lastOrderDate: null;
    }>;
}
