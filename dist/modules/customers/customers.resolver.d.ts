import { CreateCustomerInput } from './dto/create-customer.input.js';
import { CustomersService } from './customers.service.js';
import { CustomerModel } from './models/customer.model.js';
export declare class CustomersResolver {
    private readonly customersService;
    constructor(customersService: CustomersService);
    findAll(): Promise<CustomerModel[]>;
    findOne(id: string): Promise<CustomerModel>;
    createCustomer(input: CreateCustomerInput): Promise<CustomerModel>;
}
