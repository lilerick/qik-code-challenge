import { TransactionsService } from './transactions.service.js';
import { TransactionModel } from './models/transaction.model.js';
import { DepositInput } from './dto/deposit.input.js';
export declare class TransactionsResolver {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    deposit(input: DepositInput): Promise<TransactionModel>;
}
