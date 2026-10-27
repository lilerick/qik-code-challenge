import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transaction } from './entities/transaction.entity.js';

import { TransactionsResolver } from './transactions.resolver.js';

import { TransactionsService } from './transactions.service.js';
import { DepositService } from './services/deposit.service.js';
import { WithdrawalService } from './services/withdrawal.service.js';
import { TransferService } from './services/transfer.service.js';

import { SearchModule } from '../../infrastructure/search/search.module.js';
import { TransactionsSearchResolver } from './transactions-search.resolver.js';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), SearchModule],
  providers: [
    TransactionsService,
    TransactionsResolver,
    TransactionsSearchResolver,
    DepositService,
    WithdrawalService,
    TransferService,
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
