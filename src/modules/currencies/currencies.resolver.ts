import { Query, Resolver } from '@nestjs/graphql';

import { CurrenciesService } from './currencies.service.js';
import { CurrencyModel } from './models/currency.model.js';

@Resolver(() => CurrencyModel)
export class CurrenciesResolver {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Query(() => [CurrencyModel], { name: 'currencies' })
  findActive(): Promise<CurrencyModel[]> {
    return this.currenciesService.findActive();
  }
}
