var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { BadRequestException, Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity.js';
import { Customer, CustomerStatus, } from '../customers/entities/customer.entity.js';
import { Currency } from '../currencies/entities/currency.entity.js';
let AccountsService = class AccountsService {
    accountsRepository;
    customersRepository;
    currenciesRepository;
    constructor(accountsRepository, customersRepository, currenciesRepository) {
        this.accountsRepository = accountsRepository;
        this.customersRepository = customersRepository;
        this.currenciesRepository = currenciesRepository;
    }
    async create(input) {
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
    async findOne(id) {
        const account = await this.accountsRepository.findOneBy({ id });
        if (!account) {
            throw new NotFoundException('Account not found');
        }
        return account;
    }
    async findByCustomer(customerId) {
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
};
AccountsService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Account)),
    __param(1, InjectRepository(Customer)),
    __param(2, InjectRepository(Currency)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        Repository])
], AccountsService);
export { AccountsService };
//# sourceMappingURL=accounts.service.js.map