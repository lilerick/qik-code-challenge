import { Account } from '../../accounts/entities/account.entity.js';
import { Currency } from '../../currencies/entities/currency.entity.js';
export declare enum TransactionType {
    DEPOSIT = "DEPOSIT",
    WITHDRAWAL = "WITHDRAWAL",
    TRANSFER = "TRANSFER"
}
export declare enum TransactionStatus {
    COMPLETED = "COMPLETED",
    REVERSED = "REVERSED"
}
export declare class Transaction {
    id: string;
    type: TransactionType;
    status: TransactionStatus;
    sourceAccountId: string | null;
    sourceAccount: Account | null;
    destinationAccountId: string | null;
    destinationAccount: Account | null;
    amount: string;
    currencyCode: string;
    currency: Currency;
    destinationAmount: string | null;
    destinationCurrencyCode: string | null;
    destinationCurrency: Currency | null;
    exchangeRateApplied: string | null;
    idempotencyKey: string;
    createdAt: Date;
}
