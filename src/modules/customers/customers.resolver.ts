import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { Mutation } from '@nestjs/graphql';
import { CreateCustomerInput } from './dto/create-customer.input.js';

import { ParseUUIDPipe } from '@nestjs/common';
import { CustomersService } from './customers.service.js';
import { CustomerModel } from './models/customer.model.js';

@Resolver(() => CustomerModel)
export class CustomersResolver {
  constructor(private readonly customersService: CustomersService) {}

  @Query(() => [CustomerModel], { name: 'customers' })
  async findAll(): Promise<CustomerModel[]> {
    return this.customersService.findAll();
  }

  @Query(() => CustomerModel, { name: 'customer' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<CustomerModel> {
    return this.customersService.findOne(id);
  }

  @Mutation(() => CustomerModel)
  async createCustomer(
    @Args('input') input: CreateCustomerInput,
  ): Promise<CustomerModel> {
    return this.customersService.create(input);
  }
}
