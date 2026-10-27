import { DataSource } from 'typeorm';
import { Transaction } from '../entities/transaction.entity.js';
import type { TransferInput } from '../dto/transfer.input.js';
export declare class TransferService {
    private readonly dataSource;
    private readonly maxBalance;
    constructor(dataSource: DataSource);
    execute(input: TransferInput): Promise<Transaction>;
    private validateInput;
    private lockAccounts;
    private validateAccounts;
    private calculateConversion;
    private matchesRequest;
    private handleTransactionError;
}
