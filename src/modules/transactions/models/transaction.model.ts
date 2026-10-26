import { Field, ID, ObjectType } from '@nestjs/graphql';

import {
  TransactionStatus,
  TransactionType,
} from '../entities/transaction.entity.js';

@ObjectType()
export class TransactionModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  type!: TransactionType;

  @Field(() => String)
  status!: TransactionStatus;

  @Field(() => ID, { nullable: true })
  sourceAccountId!: string | null;

  @Field(() => ID, { nullable: true })
  destinationAccountId!: string | null;

  @Field()
  amount!: string;

  @Field()
  currencyCode!: string;

  @Field(() => String, { nullable: true })
  destinationAmount!: string | null;

  @Field(() => String, { nullable: true })
  destinationCurrencyCode!: string | null;

  @Field(() => String, { nullable: true })
  exchangeRateApplied!: string | null;

  @Field(() => ID)
  idempotencyKey!: string;

  @Field()
  createdAt!: Date;
}