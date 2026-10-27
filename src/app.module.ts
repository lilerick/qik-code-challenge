import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CustomersModule } from './modules/customers/customers.module.js';
import { CurrenciesModule } from './modules/currencies/currencies.module.js';
import { AccountsModule } from './modules/accounts/accounts.module.js';
import { ExchangeRatesModule } from './modules/exchange-rates/exchange-rates.module.js';
import { TransactionsModule } from './modules/transactions/transactions.module.js';
import { SearchModule } from './infrastructure/search/search.module.js';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthModule } from './modules/health/health.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    SearchModule,

    ScheduleModule.forRoot(),

    HealthModule,

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('DB_HOST'),
        port: Number(config.getOrThrow<string>('DB_PORT')),
        username: config.getOrThrow<string>('DB_USERNAME'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    CustomersModule,

    CurrenciesModule,

    AccountsModule,

    ExchangeRatesModule,

    TransactionsModule,

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
