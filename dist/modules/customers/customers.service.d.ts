import { Repository } from 'typeorm';
import type { CreateCustomerInput } from './dto/create-customer.input.js';
import { Customer } from './entities/customer.entity.js';
export declare class CustomersService {
    private readonly customersRepository;
    constructor(customersRepository: Repository<Customer>);
    findAll(): Promise<Customer[]>;
    findOne(id: string): Promise<Customer>;
    create(input: CreateCustomerInput): Promise<Customer>;
}
