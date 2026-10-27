var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TransactionsService } from './transactions.service.js';
import { TransactionModel } from './models/transaction.model.js';
import { DepositInput } from './dto/deposit.input.js';
import { WithdrawInput } from './dto/withdraw.input.js';
import { TransferInput } from './dto/transfer.input.js';
let TransactionsResolver = class TransactionsResolver {
    transactionsService;
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    async deposit(input) {
        return this.transactionsService.deposit(input);
    }
    async withdraw(input) {
        return this.transactionsService.withdraw(input);
    }
    async transfer(input) {
        return this.transactionsService.transfer(input);
    }
};
__decorate([
    Mutation(() => TransactionModel),
    __param(0, Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DepositInput]),
    __metadata("design:returntype", Promise)
], TransactionsResolver.prototype, "deposit", null);
__decorate([
    Mutation(() => TransactionModel),
    __param(0, Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WithdrawInput]),
    __metadata("design:returntype", Promise)
], TransactionsResolver.prototype, "withdraw", null);
__decorate([
    Mutation(() => TransactionModel),
    __param(0, Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TransferInput]),
    __metadata("design:returntype", Promise)
], TransactionsResolver.prototype, "transfer", null);
TransactionsResolver = __decorate([
    Resolver(() => TransactionModel),
    __metadata("design:paramtypes", [TransactionsService])
], TransactionsResolver);
export { TransactionsResolver };
//# sourceMappingURL=transactions.resolver.js.map