import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

import { TransactionType } from '../entities/transaction.entity.js';

@InputType()
export class SearchTransactionsInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  accountId?: string;

  @Field(() => TransactionType, { nullable: true })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  currencyCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @Field(() => Int, { defaultValue: 20 })
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;

  @Field(() => Int, { defaultValue: 0 })
  @IsInt()
  @Min(0)
  offset = 0;
}
