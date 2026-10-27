import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateCustomerInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName!: string;

  @Field()
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  documentNumber!: string;
}
