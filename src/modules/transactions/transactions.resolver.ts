import { Args, Mutation, Resolver, } from '@nestjs/graphql';

import { TransactionsService } from './transactions.service.js';
import { TransactionModel } from './models/transaction.model.js';
import { DepositInput } from './dto/deposit.input.js';

@Resolver(() => TransactionModel)
export class TransactionsResolver {
    constructor(
        private readonly transactionsService: TransactionsService,
    ) {}

    @Mutation(() => TransactionModel)
    async deposit(
        @Args('input') input: DepositInput,
    ): Promise<TransactionModel> {
        return this.transactionsService.deposit(input);
    }
}
