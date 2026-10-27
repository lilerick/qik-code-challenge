var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity.js';
import { TransactionsResolver } from './transactions.resolver.js';
import { TransactionsService } from './transactions.service.js';
import { DepositService } from './services/deposit.service.js';
import { WithdrawalService } from './services/withdrawal.service.js';
import { TransferService } from './services/transfer.service.js';
let TransactionsModule = class TransactionsModule {
};
TransactionsModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([Transaction])],
        providers: [TransactionsService,
            TransactionsResolver,
            DepositService,
            WithdrawalService,
            TransferService
        ],
        exports: [TransactionsService],
    })
], TransactionsModule);
export { TransactionsModule };
//# sourceMappingURL=transactions.module.js.map