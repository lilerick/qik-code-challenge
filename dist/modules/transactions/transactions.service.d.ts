import { DataSource } from 'typeorm';
import { Transaction } from './entities/transaction.entity.js';
import type { DepositInput } from './dto/deposit.input.js';
import { WithdrawInput } from './dto/withdraw.input.js';
export declare class TransactionsService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    deposit(input: DepositInput): Promise<Transaction>;
    withdraw(input: WithdrawInput): Promise<Transaction>;
}
