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

import { Currency } from '../../currencies/entities/currency.entity.js';

@Entity('exchange_rates')
@Index('IDX_exchange_rates_pair_effective', [
  'fromCurrencyCode',
  'toCurrencyCode',
  'effectiveAt',
])
@Check('CHK_exchange_rates_positive', '"rate" > 0')
@Check(
  'CHK_exchange_rates_different_currencies',
  '"from_currency_code" <> "to_currency_code"',
)
export class ExchangeRate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'from_currency_code',
    type: 'varchar',
    length: 3,
  })
  fromCurrencyCode!: string;

  @ManyToOne(() => Currency, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'from_currency_code',
    referencedColumnName: 'code',
  })
  fromCurrency!: Currency;

  @Column({
    name: 'to_currency_code',
    type: 'varchar',
    length: 3,
  })
  toCurrencyCode!: string;

  @ManyToOne(() => Currency, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'to_currency_code',
    referencedColumnName: 'code',
  })
  toCurrency!: Currency;

  @Column({
    type: 'numeric',
    precision: 24,
    scale: 12,
  })
  rate!: string;

  @Column({
    name: 'effective_at',
    type: 'timestamptz',
  })
  effectiveAt!: Date;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt!: Date;
}