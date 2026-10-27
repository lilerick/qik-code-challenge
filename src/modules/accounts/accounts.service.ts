import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { Repository } from 'typeorm';

import { Account } from './entities/account.entity.js';
import {
  Customer,
  CustomerStatus,
} from '../customers/entities/customer.entity.js';
import { Currency } from '../currencies/entities/currency.entity.js';
import type { CreateAccountInput } from './dto/create-account.input.js';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,

    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,

    @InjectRepository(Currency)
    private readonly currenciesRepository: Repository<Currency>,
  ) {}

  async create(input: CreateAccountInput): Promise<Account> {
    const customer = await this.customersRepository.findOneBy({
      id: input.customerId,
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (customer.status !== CustomerStatus.ACTIVE) {
      throw new BadRequestException('Customer is not active');
    }

    const currency = await this.currenciesRepository.findOneBy({
      code: input.currencyCode,
    });

    if (!currency || !currency.isActive) {
      throw new BadRequestException('Currency is not supported or active');
    }

    const account = this.accountsRepository.create({
      accountNumber: `QIK-${randomUUID().replace(/-/g, '').slice(0, 16).toUpperCase()}`,
      customerId: customer.id,
      currencyCode: currency.code,
      balance: '0.0000',
    });

    return this.accountsRepository.save(account);
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountsRepository.findOneBy({ id });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async findByCustomer(customerId: string): Promise<Account[]> {
    const customer = await this.customersRepository.findOneBy({
      id: customerId,
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return this.accountsRepository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
  }
}
