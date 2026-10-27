import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Account } from './entities/account.entity.js';
import { Customer } from '../customers/entities/customer.entity.js';
import { Currency } from '../currencies/entities/currency.entity.js';

import { AccountsService } from './accounts.service.js';
import { AccountsResolver } from './accounts.resolver.js';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Customer, Currency])],
  providers: [AccountsService, AccountsResolver],
  exports: [AccountsService],
})
export class AccountsModule {}
