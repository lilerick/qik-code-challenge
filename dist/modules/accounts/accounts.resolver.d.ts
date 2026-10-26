import { AccountsService } from './accounts.service.js';
import { AccountModel } from './models/account.model.js';
import { CreateAccountInput } from './dto/create-account.input.js';
export declare class AccountsResolver {
    private readonly accountsService;
    constructor(accountsService: AccountsService);
    createAccount(input: CreateAccountInput): Promise<AccountModel>;
    account(id: string): Promise<AccountModel>;
    accountsByCustomer(customerId: string): Promise<AccountModel[]>;
}
