import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DataSource } from 'typeorm';
import { Decimal } from 'decimal.js';

import {
  Account,
  AccountStatus,
} from '../accounts/entities/account.entity.js';

import {
  Transaction,
  TransactionType,
  TransactionStatus,
} from './entities/transaction.entity.js';

import type { DepositInput } from './dto/deposit.input.js';
import { WithdrawInput } from './dto/withdraw.input.js';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly dataSource: DataSource,
  ) {}

    async deposit(input: DepositInput): Promise<Transaction> {
        const amount = new Decimal(input.amount);

        if (!amount.isFinite() || amount.lte(0)) {
        throw new BadRequestException(
            'Deposit amount must be greater than zero',
        );
        }

        try {
        return await this.dataSource.transaction(
            async (manager) => {
            const accountRepo = manager.getRepository(Account);
            const transactionRepo =
                manager.getRepository(Transaction);

            // 1. Lock account row until COMMIT or ROLLBACK
            const account = await accountRepo
                .createQueryBuilder('account')
                .setLock('pessimistic_write')
                .where('account.id = :id', {
                id: input.accountId,
                })
                .getOne();

            if (!account) {
                throw new NotFoundException(
                'Account not found',
                );
            }

            // 2. Check for a previously processed request
            const existing = await transactionRepo.findOneBy({
                idempotencyKey: input.idempotencyKey,
            });

            if (existing) {
                if (
                existing.type !== TransactionType.DEPOSIT ||
                existing.destinationAccountId !== account.id ||
                !new Decimal(existing.amount).eq(amount)
                ) {
                throw new ConflictException(
                    'Idempotency key already used for another operation',
                );
                }

                return existing;
            }

            // 3. Validate account state
            if (account.status !== AccountStatus.ACTIVE) {
                throw new BadRequestException(
                'Account is not active',
                );
            }

            // 4. Calculate new balance without floating-point arithmetic
            const newBalance = new Decimal(account.balance)
                .plus(amount);

            // Respect PostgreSQL numeric(19,4)
            if (newBalance.gte('1000000000000000')) {
                throw new BadRequestException(
                'Balance exceeds the supported limit',
                );
            }

            // 5. Update account balance
            account.balance = newBalance.toFixed(4);

            await accountRepo.save(account);

            // 6. Register financial movement
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
            },
        );
        } catch (error: unknown) {
        // PostgreSQL unique-violation:
        // may indicate a concurrent request using the same key.
        const driverError = error as {
            driverError?: { code?: string };
        };

        if (driverError.driverError?.code === '23505') {
            const existing = await this.dataSource
            .getRepository(Transaction)
            .findOneBy({
                idempotencyKey: input.idempotencyKey,
            });

            if (
            existing &&
            existing.type === TransactionType.DEPOSIT &&
            existing.destinationAccountId === input.accountId &&
            new Decimal(existing.amount).eq(amount)
            ) {
            return existing;
            }

            throw new ConflictException(
            'Idempotency key already used for another operation',
            );
        }

        throw error;
        }
    }

    async withdraw(input: WithdrawInput): Promise<Transaction> {
        const amount = new Decimal(input.amount);

        if (
            !amount.isFinite() ||
            amount.lte(0) ||
            amount.decimalPlaces() > 4 ||
            amount.gte('1000000000000000')
        ) {
            throw new BadRequestException('Invalid withdrawal amount');
        }

        const matchesRequest = (transaction: Transaction): boolean =>
            transaction.type === TransactionType.WITHDRAWAL &&
            transaction.sourceAccountId === input.accountId &&
            new Decimal(transaction.amount).eq(amount);

        try {
            return await this.dataSource.transaction(async (manager) => {
            const accountRepo = manager.getRepository(Account);
            const transactionRepo = manager.getRepository(Transaction);

            // 1. Lock the account during the operation
            const account = await accountRepo
                .createQueryBuilder('account')
                .setLock('pessimistic_write')
                .where('account.id = :id', { id: input.accountId })
                .getOne();

            if (!account) {
                throw new NotFoundException('Account not found');
            }

            // 2. Check idempotency before checking balance
            const existing = await transactionRepo.findOneBy({
                idempotencyKey: input.idempotencyKey,
            });

            if (existing) {
                if (!matchesRequest(existing)) {
                throw new ConflictException(
                    'Idempotency key already used for another operation',
                );
                }

                return existing;
            }

            // 3. Validate account status
            if (account.status !== AccountStatus.ACTIVE) {
                throw new BadRequestException('Account is not active');
            }

            // 4. Validate sufficient funds
            const currentBalance = new Decimal(account.balance);

            if (currentBalance.lt(amount)) {
                throw new BadRequestException('Insufficient funds');
            }

            // 5. Calculate new balance
            const newBalance = currentBalance.minus(amount);

            // 6. Update account inside SQL transaction
            account.balance = newBalance.toFixed(4);
            await accountRepo.save(account);

            // 7. Register withdrawal inside the same SQL transaction
            const transaction = transactionRepo.create({
                type: TransactionType.WITHDRAWAL,
                status: TransactionStatus.COMPLETED,

                sourceAccountId: account.id,
                destinationAccountId: null,

                amount: amount.toFixed(4),
                currencyCode: account.currencyCode,

                destinationAmount: null,
                destinationCurrencyCode: null,
                exchangeRateApplied: null,

                idempotencyKey: input.idempotencyKey,
            });

            return await transactionRepo.save(transaction);
            });
        } catch (error: unknown) {
            // Handle concurrent requests using the same idempotency key.
            const driverError = error as {
            driverError?: { code?: string; constraint?: string };
            };

            if (
            driverError.driverError?.code === '23505' &&
            driverError.driverError.constraint ===
                'UQ_transactions_idempotency_key'
            ) {
            const existing = await this.dataSource
                .getRepository(Transaction)
                .findOneBy({
                idempotencyKey: input.idempotencyKey,
                });

            if (existing && matchesRequest(existing)) {
                return existing;
            }

            throw new ConflictException(
                'Idempotency key already used for another operation',
            );
            }

            throw error;
        }
    }
}