import { Entity, PrimaryColumn, Column, Check } from 'typeorm';

@Entity('currencies')
@Check('CHK_currencies_decimal_places', '"decimal_places" BETWEEN 0 AND 4')
export class Currency {
  @PrimaryColumn({
    type: 'varchar',
    length: 3,
  })
  code!: string;

  @Column({ length: 50 })
  name!: string;

  @Column({
    name: 'decimal_places',
    type: 'smallint',
    default: 2,
  })
  decimalPlaces!: number;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive!: boolean;
}
