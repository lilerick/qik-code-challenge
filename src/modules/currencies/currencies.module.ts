import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Currency } from './entities/currency.entity.js';
import { CurrenciesService } from './currencies.service.js';
import { RedisCacheModule } from '../../infrastructure/cache/redis-cache.module.js';
import { CurrenciesResolver } from './currencies.resolver.js';

@Module({
  imports: [TypeOrmModule.forFeature([Currency]), RedisCacheModule],
  controllers: [],
  providers: [CurrenciesService, CurrenciesResolver],
  exports: [CurrenciesService],
})
export class CurrenciesModule {}
