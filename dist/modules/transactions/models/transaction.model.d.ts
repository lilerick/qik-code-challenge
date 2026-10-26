import { TransactionStatus, TransactionType } from '../entities/transaction.entity.js';
export declare class TransactionModel {
    id: string;
    type: TransactionType;
    status: TransactionStatus;
    sourceAccountId: string | null;
    destinationAccountId: string | null;
    amount: string;
    currencyCode: string;
    destinationAmount: string | null;
    destinationCurrencyCode: string | null;
    exchangeRateApplied: string | null;
    idempotencyKey: string;
    createdAt: Date;
}
