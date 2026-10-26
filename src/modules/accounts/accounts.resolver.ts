import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';

import { AccountsService } from './accounts.service.js';
import { AccountModel } from './models/account.model.js';
import { CreateAccountInput } from './dto/create-account.input.js';

@Resolver()
export class AccountsResolver {
     constructor(
        private readonly accountsService: AccountsService,
    ) {}

    @Mutation(() => AccountModel)
        async createAccount(
            @Args('input') input: CreateAccountInput,
        ): Promise<AccountModel> {
            return this.accountsService.create(input);
    }

    @Query(() => AccountModel)
        async account(
            @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
        ): Promise<AccountModel> {
            return this.accountsService.findOne(id);
    }

    @Query(() => [AccountModel])
        async accountsByCustomer(
            @Args('customerId', { type: () => ID }, ParseUUIDPipe)
            customerId: string,
        ): Promise<AccountModel[]> {
            return this.accountsService.findByCustomer(customerId);
    }
}
