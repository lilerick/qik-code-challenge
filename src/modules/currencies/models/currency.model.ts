import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CurrencyModel {
  @Field()
  code!: string;

  @Field()
  name!: string;

  @Field(() => Int)
  decimalPlaces!: number;

  @Field()
  isActive!: boolean;
}
