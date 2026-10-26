import { Repository } from 'typeorm';
import { Account } from './entities/account.entity.js';
import { Customer } from '../customers/entities/customer.entity.js';
import { Currency } from '../currencies/entities/currency.entity.js';
import type { CreateAccountInput } from './dto/create-account.input.js';
export declare class AccountsService {
    private readonly accountsRepository;
    private readonly customersRepository;
    private readonly currenciesRepository;
    constructor(accountsRepository: Repository<Account>, customersRepository: Repository<Customer>, currenciesRepository: Repository<Currency>);
    create(input: CreateAccountInput): Promise<Account>;
    findOne(id: string): Promise<Account>;
    findByCustomer(customerId: string): Promise<Account[]>;
}
