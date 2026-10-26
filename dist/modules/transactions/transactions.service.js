var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, ConflictException, Injectable, NotFoundException, } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Decimal } from 'decimal.js';
import { Account, AccountStatus, } from '../accounts/entities/account.entity.js';
import { Transaction, TransactionType, TransactionStatus, } from './entities/transaction.entity.js';
let TransactionsService = class TransactionsService {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async deposit(input) {
        const amount = new Decimal(input.amount);
        if (!amount.isFinite() || amount.lte(0)) {
            throw new BadRequestException('Deposit amount must be greater than zero');
        }
        try {
            return await this.dataSource.transaction(async (manager) => {
                const accountRepo = manager.getRepository(Account);
                const transactionRepo = manager.getRepository(Transaction);
                const account = await accountRepo
                    .createQueryBuilder('account')
                    .setLock('pessimistic_write')
                    .where('account.id = :id', {
                    id: input.accountId,
                })
                    .getOne();
                if (!account) {
                    throw new NotFoundException('Account not found');
                }
                const existing = await transactionRepo.findOneBy({
                    idempotencyKey: input.idempotencyKey,
                });
                if (existing) {
                    if (existing.type !== TransactionType.DEPOSIT ||
                        existing.destinationAccountId !== account.id ||
                        !new Decimal(existing.amount).eq(amount)) {
                        throw new ConflictException('Idempotency key already used for another operation');
                    }
                    return existing;
                }
                if (account.status !== AccountStatus.ACTIVE) {
                    throw new BadRequestException('Account is not active');
                }
                const newBalance = new Decimal(account.balance)
                    .plus(amount);
                if (newBalance.gte('1000000000000000')) {
                    throw new BadRequestException('Balance exceeds the supported limit');
                }
                account.balance = newBalance.toFixed(4);
                await accountRepo.save(account);
                const transaction = transactionRepo.create({
                    type: TransactionType.DEPOSIT,
                    status: TransactionStatus.COMPLETED,
                    sourceAccountId: null,
                    destinationAccountId: account.id,
                    amount: amount.toFixed(4),
                    currencyCode: account.currencyCode,
                    destinationAmount: null,
                    destinationCurrencyCode: null,
                    exchangeRateApplied: null,
                    idempotencyKey: input.idempotencyKey,
                });
                return await transactionRepo.save(transaction);
            });
        }
        catch (error) {
            const driverError = error;
            if (driverError.driverError?.code === '23505') {
                const existing = await this.dataSource
                    .getRepository(Transaction)
                    .findOneBy({
                    idempotencyKey: input.idempotencyKey,
                });
                if (existing &&
                    existing.type === TransactionType.DEPOSIT &&
                    existing.destinationAccountId === input.accountId &&
                    new Decimal(existing.amount).eq(amount)) {
                    return existing;
                }
                throw new ConflictException('Idempotency key already used for another operation');
            }
            throw error;
        }
    }
};
TransactionsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DataSource])
], TransactionsService);
export { TransactionsService };
//# sourceMappingURL=transactions.service.js.map