import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExchangeRate } from './entities/exchange-rate.entity.js';
import { ExchangeRatesService } from './exchange-rates.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeRate])],
  providers: [ExchangeRatesService],
  exports: [ExchangeRatesService],
})
export class ExchangeRatesModule {}
