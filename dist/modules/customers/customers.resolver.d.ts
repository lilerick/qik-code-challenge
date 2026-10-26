import { CustomersService } from './customers.service.js';
import { CustomerModel } from './models/customer.model.js';
export declare class CustomersResolver {
    private readonly customersService;
    constructor(customersService: CustomersService);
    findAll(): Promise<CustomerModel[]>;
}
