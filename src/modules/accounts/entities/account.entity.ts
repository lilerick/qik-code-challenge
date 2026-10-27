import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
} from 'typeorm';

import { Customer } from '../../customers/entities/customer.entity.js';
import { Currency } from '../../currencies/entities/currency.entity.js';

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  FROZEN = 'FROZEN',
  CLOSED = 'CLOSED',
}

@Entity('accounts')
@Check('CHK_accounts_balance_nonnegative', '"balance" >= 0')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'account_number',
    type: 'varchar',
    length: 20,
    unique: true,
  })
  accountNumber!: string;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId!: string;

  @ManyToOne(() => Customer, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'customer_id' })
  customer!: Customer;

  @Column({ name: 'currency_code', type: 'varchar', length: 3 })
  currencyCode!: string;

  @ManyToOne(() => Currency, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'currency_code', referencedColumnName: 'code' })
  currency!: Currency;

  @Column({
    type: 'numeric',
    precision: 19,
    scale: 4,
    default: 0,
  })
  balance!: string;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    enumName: 'account_status_enum',
    default: AccountStatus.ACTIVE,
  })
  status!: AccountStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
