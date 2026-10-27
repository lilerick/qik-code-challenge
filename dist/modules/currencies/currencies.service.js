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
var CurrenciesService_1;
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './entities/currency.entity.js';
import { RedisCacheService } from '../../infrastructure/cache/redis-cache.service.js';
let CurrenciesService = CurrenciesService_1 = class CurrenciesService {
    currenciesRepository;
    cacheService;
    logger = new Logger(CurrenciesService_1.name);
    cacheKey = 'currencies:active:v1';
    cacheTtl = 60_000;
    constructor(currenciesRepository, cacheService) {
        this.currenciesRepository = currenciesRepository;
        this.cacheService = cacheService;
    }
    async findActive() {
        try {
            const cached = await this.cacheService.get(this.cacheKey);
            if (cached != null) {
                this.logger.debug('Currency cache HIT');
                return cached;
            }
        }
        catch {
            this.logger.warn('Redis read failed. Using PostgreSQL.');
        }
        this.logger.debug('Currency cache MISS');
        const currencies = await this.currenciesRepository.find({
            where: { isActive: true },
            order: { code: 'ASC' },
        });
        try {
            await this.cacheService.set(this.cacheKey, currencies, this.cacheTtl);
        }
        catch {
            this.logger.warn('Redis write failed.');
        }
        return currencies;
    }
};
CurrenciesService = CurrenciesService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(Currency)),
    __metadata("design:paramtypes", [Repository,
        RedisCacheService])
], CurrenciesService);
export { CurrenciesService };
//# sourceMappingURL=currencies.service.js.map