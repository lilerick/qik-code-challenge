import { AccountStatus } from '../entities/account.entity.js';
export declare class AccountModel {
    id: string;
    accountNumber: string;
    customerId: string;
    currencyCode: string;
    balance: string;
    status: AccountStatus;
    createdAt: Date;
    updatedAt: Date;
}
