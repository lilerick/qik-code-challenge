import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsUUID,
  IsString,
  Matches,
} from 'class-validator';

@InputType()
export class DepositInput {
  @Field(() => ID)
  @IsUUID()
  accountId!: string;

  @Field()
  @IsString()
  @Matches(/^(?:0|[1-9]\d{0,14})(?:\.\d{1,4})?$/, {
    message:
      'Amount must be a positive-format decimal with up to 4 decimal places',
  })
  amount!: string;

  @Field(() => ID)
  @IsUUID()
  idempotencyKey!: string;
}