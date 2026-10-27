import { BadRequestException } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { SearchService } from '../../infrastructure/search/search.service.js';

import { SearchTransactionsInput } from './dto/search-transactions.input.js';
import { TransactionModel } from './models/transaction.model.js';

@Resolver(() => TransactionModel)
export class TransactionsSearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => [TransactionModel], {
    name: 'searchTransactions',
  })
  searchTransactions(
    @Args('input') input: SearchTransactionsInput,
  ): Promise<TransactionModel[]> {
    if (input.offset + input.limit > 10_000) {
      throw new BadRequestException(
        'Pagination exceeds the supported search window',
      );
    }

    if (
      input.fromDate &&
      input.toDate &&
      new Date(input.fromDate) > new Date(input.toDate)
    ) {
      throw new BadRequestException('fromDate must be earlier than toDate');
    }

    return this.searchService.searchTransactions(input);
  }
}
