import { Field, ID, ObjectType } from '@nestjs/graphql';
import { AccountStatus } from '../entities/account.entity.js';

@ObjectType()
export class AccountModel {
  @Field(() => ID)
  id!: string;

  @Field()
  accountNumber!: string;

  @Field(() => ID)
  customerId!: string;

  @Field()
  currencyCode!: string;

  @Field()
  balance!: string;

  @Field(() => String)
  status!: AccountStatus;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}