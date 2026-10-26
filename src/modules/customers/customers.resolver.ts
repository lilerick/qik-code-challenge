import { Resolver, Query } from '@nestjs/graphql';

import { CustomersService } from './customers.service.js';
import { CustomerModel } from './models/customer.model.js';

@Resolver(() => CustomerModel)
export class CustomersResolver {
  constructor(
    private readonly customersService: CustomersService,
  ) {}

  @Query(() => [CustomerModel], { name: 'customers' })
  async findAll(): Promise<CustomerModel[]> {
    return this.customersService.findAll();
  }
}