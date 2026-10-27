import { Injectable } from '@nestjs/common';


import type { Transaction } from './entities/transaction.entity.js';

import { DepositService } from './services/deposit.service.js';
import { WithdrawalService } from './services/withdrawal.service.js';
import { TransferService } from './services/transfer.service.js';

import { WithdrawInput } from './dto/withdraw.input.js';
import { TransferInput } from './dto/transfer.input.js';
import { DepositInput } from './dto/deposit.input.js';


@Injectable()
export class TransactionsService {
  constructor(
        private readonly depositService: DepositService,
        private readonly withdrawalService: WithdrawalService,
        private readonly transferService: TransferService,
    ) {}

    deposit(input: DepositInput): Promise<Transaction> {
        return this.depositService.execute(input);
    }


    withdraw(input: WithdrawInput): Promise<Transaction> {
        return this.withdrawalService.execute(input);
    }

    transfer(input: TransferInput): Promise<Transaction> {
        return this.transferService.execute(input);
    }
}