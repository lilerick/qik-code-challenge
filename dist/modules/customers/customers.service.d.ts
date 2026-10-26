import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity.js';
export declare class CustomersService {
    private readonly customersRepository;
    constructor(customersRepository: Repository<Customer>);
    findAll(): Promise<Customer[]>;
}
