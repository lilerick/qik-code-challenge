import { Field, ID, InputType } from '@nestjs/graphql';
import { IsString, IsUUID, Matches } from 'class-validator';

@InputType()
export class TransferInput {
  @Field(() => ID)
  @IsUUID()
  sourceAccountId!: string;

  @Field(() => ID)
  @IsUUID()
  destinationAccountId!: string;

  @Field()
  @IsString()
  @Matches(/^(?:0|[1-9]\d{0,14})(?:\.\d{1,4})?$/, {
    message: 'Amount must be a decimal with up to 4 decimal places',
  })
  amount!: string;

  @Field(() => ID)
  @IsUUID()
  idempotencyKey!: string;
}