var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CustomersModule } from './modules/customers/customers.module.js';
import { CurrenciesModule } from './modules/currencies/currencies.module.js';
import { AccountsModule } from './modules/accounts/accounts.module.js';
import { ExchangeRatesModule } from './modules/exchange-rates/exchange-rates.module.js';
import { TransactionsModule } from './modules/transactions/transactions.module.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [ConfigModule.forRoot({
                isGlobal: true,
            }),
            TypeOrmModule.forRootAsync({
                inject: [ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    host: config.getOrThrow('DB_HOST'),
                    port: Number(config.getOrThrow('DB_PORT')),
                    username: config.getOrThrow('DB_USERNAME'),
                    password: config.getOrThrow('DB_PASSWORD'),
                    database: config.getOrThrow('DB_DATABASE'),
                    autoLoadEntities: true,
                    synchronize: false,
                }),
            }),
            CustomersModule,
            CurrenciesModule,
            AccountsModule,
            ExchangeRatesModule,
            TransactionsModule,],
        controllers: [AppController],
        providers: [AppService],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map