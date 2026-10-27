import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transaction } from './entities/transaction.entity.js';

import { TransactionsResolver } from './transactions.resolver.js';

import { TransactionsService } from './transactions.service.js';
import { DepositService } from './services/deposit.service.js';
import { WithdrawalService } from './services/withdrawal.service.js';
import { TransferService } from './services/transfer.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [TransactionsService, 
    TransactionsResolver,
    DepositService,
    WithdrawalService,
    TransferService
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
