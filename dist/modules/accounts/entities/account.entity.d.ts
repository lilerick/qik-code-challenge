import { Customer } from '../../customers/entities/customer.entity.js';
import { Currency } from '../../currencies/entities/currency.entity.js';
export declare enum AccountStatus {
    ACTIVE = "ACTIVE",
    FROZEN = "FROZEN",
    CLOSED = "CLOSED"
}
export declare class Account {
    id: string;
    accountNumber: string;
    customerId: string;
    customer: Customer;
    currencyCode: string;
    currency: Currency;
    balance: string;
    status: AccountStatus;
    createdAt: Date;
    updatedAt: Date;
}
