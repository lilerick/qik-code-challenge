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
import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { Mutation } from '@nestjs/graphql';
import { CreateCustomerInput } from './dto/create-customer.input.js';
import { ParseUUIDPipe } from '@nestjs/common';
import { CustomersService } from './customers.service.js';
import { CustomerModel } from './models/customer.model.js';
let CustomersResolver = class CustomersResolver {
    customersService;
    constructor(customersService) {
        this.customersService = customersService;
    }
    async findAll() {
        return this.customersService.findAll();
    }
    async findOne(id) {
        return this.customersService.findOne(id);
    }
    async createCustomer(input) {
        return this.customersService.create(input);
    }
};
__decorate([
    Query(() => [CustomerModel], { name: 'customers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomersResolver.prototype, "findAll", null);
__decorate([
    Query(() => CustomerModel, { name: 'customer' }),
    __param(0, Args('id', { type: () => ID }, ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersResolver.prototype, "findOne", null);
__decorate([
    Mutation(() => CustomerModel),
    __param(0, Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCustomerInput]),
    __metadata("design:returntype", Promise)
], CustomersResolver.prototype, "createCustomer", null);
CustomersResolver = __decorate([
    Resolver(() => CustomerModel),
    __metadata("design:paramtypes", [CustomersService])
], CustomersResolver);
export { CustomersResolver };
//# sourceMappingURL=customers.resolver.js.map