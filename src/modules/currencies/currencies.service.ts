import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Currency } from './entities/currency.entity.js';
import { RedisCacheService } from '../../infrastructure/cache/redis-cache.service.js';

@Injectable()
export class CurrenciesService {
  private readonly logger = new Logger(CurrenciesService.name);

  private readonly cacheKey = 'currencies:active:v1';
  private readonly cacheTtl = 60_000; // 60 seconds

  constructor(
    @InjectRepository(Currency)
    private readonly currenciesRepository: Repository<Currency>,

    private readonly cacheService: RedisCacheService,
  ) {}

  async findActive(): Promise<Currency[]> {
    try {
      const cached = await this.cacheService.get<Currency[]>(this.cacheKey);

      if (cached != null) {
        this.logger.debug('Currency cache HIT');
        return cached;
      }
    } catch {
      this.logger.warn('Redis read failed. Using PostgreSQL.');
    }

    this.logger.debug('Currency cache MISS');

    const currencies = await this.currenciesRepository.find({
      where: { isActive: true },
      order: { code: 'ASC' },
    });

    try {
      await this.cacheService.set(this.cacheKey, currencies, this.cacheTtl);
    } catch {
      this.logger.warn('Redis write failed.');
    }

    return currencies;
  }
}
