import { DataSource } from 'typeorm';
import { Transaction } from '../entities/transaction.entity.js';
import type { DepositInput } from '../dto/deposit.input.js';
export declare class DepositService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    execute(input: DepositInput): Promise<Transaction>;
}
