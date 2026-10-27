import type { Transaction } from './entities/transaction.entity.js';
import { DepositService } from './services/deposit.service.js';
import { WithdrawalService } from './services/withdrawal.service.js';
import { TransferService } from './services/transfer.service.js';
import { WithdrawInput } from './dto/withdraw.input.js';
import { TransferInput } from './dto/transfer.input.js';
import { DepositInput } from './dto/deposit.input.js';
export declare class TransactionsService {
    private readonly depositService;
    private readonly withdrawalService;
    private readonly transferService;
    constructor(depositService: DepositService, withdrawalService: WithdrawalService, transferService: TransferService);
    deposit(input: DepositInput): Promise<Transaction>;
    withdraw(input: WithdrawInput): Promise<Transaction>;
    transfer(input: TransferInput): Promise<Transaction>;
}
