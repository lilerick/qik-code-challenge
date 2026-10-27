import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Customer } from '../modules/customers/entities/customer.entity.js';
import { Currency } from '../modules/currencies/entities/currency.entity.js';
import { Account } from '../modules/accounts/entities/account.entity.js';
import { ExchangeRate } from '../modules/exchange-rates/entities/exchange-rate.entity.js';
import { Transaction } from '../modules/transactions/entities/transaction.entity.js';
const isCompiled = import.meta.url.endsWith('.js');
export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [Customer, Currency, Account, ExchangeRate, Transaction],
    migrations: [
        isCompiled
            ? 'dist/database/migrations/*.js'
            : 'src/database/migrations/*.ts',
    ],
    synchronize: false,
    migrationsRun: false,
});
//# sourceMappingURL=data-source.js.map