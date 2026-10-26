import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import type { CreateCustomerInput } from './dto/create-customer.input.js';

import { Customer } from './entities/customer.entity.js';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private readonly customersRepository: Repository<Customer>,
    ) {}

    async findAll(): Promise<Customer[]> {
        return this.customersRepository.find({
        order: {
            createdAt: 'DESC',
        },
        });
    }

    async findOne(id: string): Promise<Customer> {
        const customer = await this.customersRepository.findOneBy({ id });

        if (!customer) {
            throw new NotFoundException(`Customer with ID ${id} not found`);
        }

        return customer;
    }

    async create(input: CreateCustomerInput): Promise<Customer> {
        const customer = this.customersRepository.create({
            firstName: input.firstName.trim(),
            lastName: input.lastName.trim(),
            email: input.email.trim().toLowerCase(),
            documentNumber: input.documentNumber.trim(),
        });

        try {
            return await this.customersRepository.save(customer);
        } catch (error: unknown) {
            if (
            error instanceof QueryFailedError &&
            (error.driverError as { code?: string })?.code === '23505'
            ) {
            throw new ConflictException(
                'A customer with this email or document already exists',
            );
            }

            throw error;
        }
    }
}