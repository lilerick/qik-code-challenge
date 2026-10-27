import { DataSource } from 'typeorm';
import { Transaction } from '../entities/transaction.entity.js';
import type { WithdrawInput } from '../dto/withdraw.input.js';
export declare class WithdrawalService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    execute(input: WithdrawInput): Promise<Transaction>;
}
