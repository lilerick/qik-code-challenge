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
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { AccountsService } from './accounts.service.js';
import { AccountModel } from './models/account.model.js';
import { CreateAccountInput } from './dto/create-account.input.js';
let AccountsResolver = class AccountsResolver {
    accountsService;
    constructor(accountsService) {
        this.accountsService = accountsService;
    }
    async createAccount(input) {
        return this.accountsService.create(input);
    }
    async account(id) {
        return this.accountsService.findOne(id);
    }
    async accountsByCustomer(customerId) {
        return this.accountsService.findByCustomer(customerId);
    }
};
__decorate([
    Mutation(() => AccountModel),
    __param(0, Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAccountInput]),
    __metadata("design:returntype", Promise)
], AccountsResolver.prototype, "createAccount", null);
__decorate([
    Query(() => AccountModel),
    __param(0, Args('id', { type: () => ID }, ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountsResolver.prototype, "account", null);
__decorate([
    Query(() => [AccountModel]),
    __param(0, Args('customerId', { type: () => ID }, ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountsResolver.prototype, "accountsByCustomer", null);
AccountsResolver = __decorate([
    Resolver(),
    __metadata("design:paramtypes", [AccountsService])
], AccountsResolver);
export { AccountsResolver };
//# sourceMappingURL=accounts.resolver.js.map