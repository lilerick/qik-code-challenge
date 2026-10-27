import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';
import { Decimal } from 'decimal.js';

import {
    Account,
    AccountStatus,
} from '../../accounts/entities/account.entity.js';

import { Currency } from '../../currencies/entities/currency.entity.js';
import { ExchangeRate } from '../../exchange-rates/entities/exchange-rate.entity.js';

import {
    Transaction,
    TransactionStatus,
    TransactionType,
} from '../entities/transaction.entity.js';

import type { TransferInput } from '../dto/transfer.input.js';

@Injectable()
export class TransferService {
    private readonly maxBalance = new Decimal('1000000000000000');

    constructor(private readonly dataSource: DataSource) { }

    async execute(input: TransferInput): Promise<Transaction> {
        const amount = new Decimal(input.amount);

        this.validateInput(input, amount);

        try {
            return await this.dataSource.transaction(async (manager) => {
                // 1. Lock both accounts
                const { source, destination } = await this.lockAccounts(
                    manager,
                    input.sourceAccountId,
                    input.destinationAccountId,
                );

                const transactionRepo = manager.getRepository(Transaction);

                // 2. Check idempotency
                const existing = await transactionRepo.findOneBy({
                    idempotencyKey: input.idempotencyKey,
                });

                if (existing) {
                    if (!this.matchesRequest(existing, input, amount)) {
                        throw new ConflictException(
                            'Idempotency key already used for another operation',
                        );
                    }

                    return existing;
                }

                // 3. Validate accounts and available funds
                this.validateAccounts(source, destination, amount);

                // 4. Calculate destination amount
                const { destinationAmount, exchangeRateApplied } =
                    await this.calculateConversion(
                        manager,
                        source,
                        destination,
                        amount,
                    );

                // 5. Calculate new balances
                const newSourceBalance = new Decimal(source.balance).minus(amount);

                const newDestinationBalance = new Decimal(
                    destination.balance,
                ).plus(destinationAmount);

                if (newDestinationBalance.gte(this.maxBalance)) {
                    throw new BadRequestException(
                        'Destination balance exceeds supported limit',
                    );
                }

                // 6. Update both accounts within the same SQL transaction
                source.balance = newSourceBalance.toFixed(4);
                destination.balance = newDestinationBalance.toFixed(4);

                const accountRepo = manager.getRepository(Account);

                await accountRepo.save(source);
                await accountRepo.save(destination);

                // 7. Register the transfer
                const transaction = transactionRepo.create({
                    type: TransactionType.TRANSFER,
                    status: TransactionStatus.COMPLETED,

                    sourceAccountId: source.id,
                    destinationAccountId: destination.id,

                    amount: amount.toFixed(4),
                    currencyCode: source.currencyCode,

                    destinationAmount: destinationAmount.toFixed(4),
                    destinationCurrencyCode: destination.currencyCode,
                    exchangeRateApplied,

                    idempotencyKey: input.idempotencyKey,
                });

                return await transactionRepo.save(transaction);
            });
        } catch (error: unknown) {
            return this.handleTransactionError(error, input, amount);
        }
    }

    private validateInput(input: TransferInput, amount: Decimal): void {
        if (
            !amount.isFinite() ||
            amount.lte(0) ||
            amount.decimalPlaces() > 4 ||
            amount.gte(this.maxBalance)
        ) {
            throw new BadRequestException('Invalid transfer amount');
        }

        if (input.sourceAccountId === input.destinationAccountId) {
            throw new BadRequestException(
                'Source and destination accounts must be different',
            );
        }
    }

    private async lockAccounts(
        manager: EntityManager,
        sourceId: string,
        destinationId: string,
    ): Promise<{ source: Account; destination: Account }> {
        const accountRepo = manager.getRepository(Account);

        const sortedIds = [sourceId, destinationId].sort();
        const lockedAccounts = new Map<string, Account>();

        for (const id of sortedIds) {
            const account = await accountRepo
                .createQueryBuilder('account')
                .setLock('pessimistic_write')
                .where('account.id = :id', { id })
                .getOne();

            if (!account) {
                throw new NotFoundException(`Account ${id} not found`);
            }

            lockedAccounts.set(id, account);
        }

        return {
            source: lockedAccounts.get(sourceId)!,
            destination: lockedAccounts.get(destinationId)!,
        };
    }

    private validateAccounts(
        source: Account,
        destination: Account,
        amount: Decimal,
    ): void {
        if (
            source.status !== AccountStatus.ACTIVE ||
            destination.status !== AccountStatus.ACTIVE
        ) {
            throw new BadRequestException('Both accounts must be active');
        }

        if (new Decimal(source.balance).lt(amount)) {
            throw new BadRequestException('Insufficient funds');
        }
    }

    private async calculateConversion(
        manager: EntityManager,
        source: Account,
        destination: Account,
        amount: Decimal,
    ): Promise<{
        destinationAmount: Decimal;
        exchangeRateApplied: string | null;
    }> {
        const currencyRepo = manager.getRepository(Currency);

        const sourceCurrency = await currencyRepo.findOneBy({
            code: source.currencyCode,
        });

        const destinationCurrency = await currencyRepo.findOneBy({
            code: destination.currencyCode,
        });

        if (!sourceCurrency?.isActive || !destinationCurrency?.isActive) {
            throw new BadRequestException(
                'Unsupported or inactive currency',
            );
        }

        if (amount.decimalPlaces() > sourceCurrency.decimalPlaces) {
            throw new BadRequestException(
                'Amount exceeds source currency precision',
            );
        }

        let destinationAmount = amount;
        let exchangeRateApplied: string | null = null;

        if (source.currencyCode !== destination.currencyCode) {
            const rate = await manager
                .getRepository(ExchangeRate)
                .createQueryBuilder('rate')
                .where('rate.fromCurrencyCode = :from', {
                    from: source.currencyCode,
                })
                .andWhere('rate.toCurrencyCode = :to', {
                    to: destination.currencyCode,
                })
                .andWhere('rate.effectiveAt <= :now', {
                    now: new Date(),
                })
                .orderBy('rate.effectiveAt', 'DESC')
                .addOrderBy('rate.createdAt', 'DESC')
                .getOne();

            if (!rate) {
                throw new BadRequestException('Exchange rate not available');
            }

            exchangeRateApplied = rate.rate;

            destinationAmount = amount
                .mul(new Decimal(rate.rate))
                .toDecimalPlaces(
                    destinationCurrency.decimalPlaces,
                    Decimal.ROUND_HALF_UP,
                );
        }

        if (destinationAmount.lte(0)) {
            throw new BadRequestException('Converted amount is too small');
        }

        return { destinationAmount, exchangeRateApplied };
    }

    private matchesRequest(
        transaction: Transaction,
        input: TransferInput,
        amount: Decimal,
    ): boolean {
        return (
            transaction.type === TransactionType.TRANSFER &&
            transaction.sourceAccountId === input.sourceAccountId &&
            transaction.destinationAccountId === input.destinationAccountId &&
            new Decimal(transaction.amount).eq(amount)
        );
    }

    private async handleTransactionError(
        error: unknown,
        input: TransferInput,
        amount: Decimal,
    ): Promise<Transaction> {
        const driverError = error as {
            driverError?: {
                code?: string;
                constraint?: string;
            };
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

            if (existing && this.matchesRequest(existing, input, amount)) {
                return existing;
            }

            throw new ConflictException(
                'Idempotency key already used for another operation',
            );
        }

        throw error;
    }
}