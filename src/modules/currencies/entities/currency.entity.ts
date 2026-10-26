import {
  Entity,
  PrimaryColumn,
  Column,
} from 'typeorm';

@Entity('currencies')
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