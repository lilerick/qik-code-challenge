import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
  Check,
} from 'typeorm';

import { Account } from '../../accounts/entities/account.entity.js';
import { Currency } from '../../currencies/entities/currency.entity.js';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
}

export enum TransactionStatus {
  COMPLETED = 'COMPLETED',
  REVERSED = 'REVERSED',
}

@Entity('transactions')
@Check(
  'CHK_transactions_currency_fields',
  `(
    (
      "type" IN ('DEPOSIT', 'WITHDRAWAL')
      AND "destination_amount" IS NULL
      AND "destination_currency_code" IS NULL
      AND "exchange_rate_applied" IS NULL
    )
    OR
    (
      "type" = 'TRANSFER'
      AND "destination_amount" IS NOT NULL
      AND "destination_currency_code" IS NOT NULL
      AND (
        (
          "currency_code" = "destination_currency_code"
          AND "exchange_rate_applied" IS NULL
        )
        OR
        (
          "currency_code" <> "destination_currency_code"
          AND "exchange_rate_applied" IS NOT NULL
        )
      )
    )
  )`,
)
@Check('CHK_transactions_positive_amount', '"amount" > 0')
@Check(
  'CHK_transactions_destination_amount',
  '"destination_amount" IS NULL OR "destination_amount" > 0',
)
@Check(
  'CHK_transactions_exchange_rate',
  '"exchange_rate_applied" IS NULL OR "exchange_rate_applied" > 0',
)
@Check(
  'CHK_transactions_accounts',
  `(
    ("type" = 'DEPOSIT'
      AND "source_account_id" IS NULL
      AND "destination_account_id" IS NOT NULL)
    OR
    ("type" = 'WITHDRAWAL'
      AND "source_account_id" IS NOT NULL
      AND "destination_account_id" IS NULL)
    OR
    ("type" = 'TRANSFER'
      AND "source_account_id" IS NOT NULL
      AND "destination_account_id" IS NOT NULL
      AND "source_account_id" <> "destination_account_id")
  )`,
)
@Index('IDX_transactions_source_created', ['sourceAccountId', 'createdAt'])
@Index('IDX_transactions_destination_created', [
  'destinationAccountId',
  'createdAt',
])
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
    enumName: 'transaction_type_enum',
  })
  type!: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    enumName: 'transaction_status_enum',
    default: TransactionStatus.COMPLETED,
  })
  status!: TransactionStatus;

  @Column({
    name: 'source_account_id',
    type: 'uuid',
    nullable: true,
  })
  sourceAccountId!: string | null;

  @ManyToOne(() => Account, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'source_account_id' })
  sourceAccount!: Account | null;

  @Column({
    name: 'destination_account_id',
    type: 'uuid',
    nullable: true,
  })
  destinationAccountId!: string | null;

  @ManyToOne(() => Account, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'destination_account_id' })
  destinationAccount!: Account | null;

  @Column({
    type: 'numeric',
    precision: 19,
    scale: 4,
  })
  amount!: string;

  @Column({
    name: 'currency_code',
    type: 'varchar',
    length: 3,
  })
  currencyCode!: string;

  @ManyToOne(() => Currency, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'currency_code',
    referencedColumnName: 'code',
  })
  currency!: Currency;

  @Column({
    name: 'destination_amount',
    type: 'numeric',
    precision: 19,
    scale: 4,
    nullable: true,
  })
  destinationAmount!: string | null;

  @Column({
    name: 'destination_currency_code',
    type: 'varchar',
    length: 3,
    nullable: true,
  })
  destinationCurrencyCode!: string | null;

  @ManyToOne(() => Currency, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'destination_currency_code',
    referencedColumnName: 'code',
  })
  destinationCurrency!: Currency | null;

  @Column({
    name: 'exchange_rate_applied',
    type: 'numeric',
    precision: 24,
    scale: 12,
    nullable: true,
  })
  exchangeRateApplied!: string | null;

  @Index('UQ_transactions_idempotency_key', { unique: true })
  @Column({
    name: 'idempotency_key',
    type: 'uuid',
  })
  idempotencyKey!: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt!: Date;
}
