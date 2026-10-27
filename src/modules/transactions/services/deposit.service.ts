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
} from '../../accounts/entities/account.entity.js';

import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../entities/transaction.entity.js';

import type { DepositInput } from '../dto/deposit.input.js';

@Injectable()
export class DepositService {
  constructor(
    private readonly dataSource: DataSource,
  ) {}

  async execute(input: DepositInput): Promise<Transaction> {
    const amount = new Decimal(input.amount);

    if (
      !amount.isFinite() ||
      amount.lte(0) ||
      amount.decimalPlaces() > 4 ||
      amount.gte('1000000000000000')
    ) {
      throw new BadRequestException('Invalid deposit amount');
    }

    try {
      return await this.dataSource.transaction(async (manager) => {
        const accountRepo = manager.getRepository(Account);
        const transactionRepo = manager.getRepository(Transaction);

        // 1. Lock account until COMMIT or ROLLBACK
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

        // 2. Check idempotency before modifying the balance
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

        // 3. Validate account status
        if (account.status !== AccountStatus.ACTIVE) {
          throw new BadRequestException('Account is not active');
        }

        // 4. Calculate the new balance precisely
        const newBalance = new Decimal(account.balance).plus(amount);

        if (newBalance.gte('1000000000000000')) {
          throw new BadRequestException(
            'Balance exceeds the supported limit',
          );
        }

        // 5. Update balance within the SQL transaction
        account.balance = newBalance.toFixed(4);
        await accountRepo.save(account);

        // 6. Register movement within the same SQL transaction
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
    } catch (error: unknown) {
      const driverError = error as {
        driverError?: {
          code?: string;
          constraint?: string;
        };
      };

      // Handle concurrent requests with the same idempotency key
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
}