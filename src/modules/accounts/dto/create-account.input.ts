import { Field, ID, InputType } from '@nestjs/graphql';
import { IsIn, IsUUID } from 'class-validator';

@InputType()
export class CreateAccountInput {
  @Field(() => ID)
  @IsUUID()
  customerId!: string;

  @Field()
  @IsIn(['DOP', 'USD', 'EUR'])
  currencyCode!: string;
}
