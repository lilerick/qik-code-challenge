import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CustomerStatus } from '../entities/customer.entity.js';

@ObjectType()
export class CustomerModel {
  @Field(() => ID)
  id!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  email!: string;

  @Field()
  documentNumber!: string;

  @Field(() => String)
  status!: CustomerStatus;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}