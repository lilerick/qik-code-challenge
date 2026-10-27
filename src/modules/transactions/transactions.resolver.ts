import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { TransactionsService } from './transactions.service.js';
import { TransactionModel } from './models/transaction.model.js';
import { DepositInput } from './dto/deposit.input.js';
import { WithdrawInput } from './dto/withdraw.input.js';
import { TransferInput } from './dto/transfer.input.js';

import { registerEnumType } from '@nestjs/graphql';
import { TransactionType } from './entities/transaction.entity.js';

registerEnumType(TransactionType, {
  name: 'TransactionType',
});

@Resolver(() => TransactionModel)
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Mutation(() => TransactionModel)
  async deposit(@Args('input') input: DepositInput): Promise<TransactionModel> {
    return this.transactionsService.deposit(input);
  }

  @Mutation(() => TransactionModel)
  async withdraw(
    @Args('input') input: WithdrawInput,
  ): Promise<TransactionModel> {
    return this.transactionsService.withdraw(input);
  }

  @Mutation(() => TransactionModel)
  async transfer(
    @Args('input') input: TransferInput,
  ): Promise<TransactionModel> {
    return this.transactionsService.transfer(input);
  }
}
