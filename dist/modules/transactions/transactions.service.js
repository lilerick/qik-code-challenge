var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { DepositService } from './services/deposit.service.js';
import { WithdrawalService } from './services/withdrawal.service.js';
import { TransferService } from './services/transfer.service.js';
let TransactionsService = class TransactionsService {
    depositService;
    withdrawalService;
    transferService;
    constructor(depositService, withdrawalService, transferService) {
        this.depositService = depositService;
        this.withdrawalService = withdrawalService;
        this.transferService = transferService;
    }
    deposit(input) {
        return this.depositService.execute(input);
    }
    withdraw(input) {
        return this.withdrawalService.execute(input);
    }
    transfer(input) {
        return this.transferService.execute(input);
    }
};
TransactionsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DepositService,
        WithdrawalService,
        TransferService])
], TransactionsService);
export { TransactionsService };
//# sourceMappingURL=transactions.service.js.map