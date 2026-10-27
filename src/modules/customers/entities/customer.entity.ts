import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'first_name', length: 100 })
  firstName!: string;

  @Column({ name: 'last_name', length: 100 })
  lastName!: string;

  @Index('UQ_customers_email', { unique: true })
  @Column({ length: 255 })
  email!: string;

  @Index('UQ_customers_document_number', { unique: true })
  @Column({ name: 'document_number', length: 30 })
  documentNumber!: string;

  @Column({
    type: 'enum',
    enum: CustomerStatus,
    enumName: 'customer_status_enum',
    default: CustomerStatus.ACTIVE,
  })
  status!: CustomerStatus;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt!: Date;
}
