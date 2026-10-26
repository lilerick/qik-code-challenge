import { DataSource } from 'typeorm';
import { Transaction } from './entities/transaction.entity.js';
import type { DepositInput } from './dto/deposit.input.js';
export declare class TransactionsService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    deposit(input: DepositInput): Promise<Transaction>;
}
