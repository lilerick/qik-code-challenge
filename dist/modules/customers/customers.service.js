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
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Customer } from './entities/customer.entity.js';
let CustomersService = class CustomersService {
    customersRepository;
    constructor(customersRepository) {
        this.customersRepository = customersRepository;
    }
    async findAll() {
        return this.customersRepository.find({
            order: {
                createdAt: 'DESC',
            },
        });
    }
    async findOne(id) {
        const customer = await this.customersRepository.findOneBy({ id });
        if (!customer) {
            throw new NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer;
    }
    async create(input) {
        const customer = this.customersRepository.create({
            firstName: input.firstName.trim(),
            lastName: input.lastName.trim(),
            email: input.email.trim().toLowerCase(),
            documentNumber: input.documentNumber.trim(),
        });
        try {
            return await this.customersRepository.save(customer);
        }
        catch (error) {
            if (error instanceof QueryFailedError &&
                error.driverError?.code === '23505') {
                throw new ConflictException('A customer with this email or document already exists');
            }
            throw error;
        }
    }
};
CustomersService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Customer)),
    __metadata("design:paramtypes", [Repository])
], CustomersService);
export { CustomersService };
//# sourceMappingURL=customers.service.js.map