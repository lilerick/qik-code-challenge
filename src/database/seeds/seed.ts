import AppDataSource from '../data-source.js';

import { Customer } from '../../modules/customers/entities/customer.entity.js';
import { Currency } from '../../modules/currencies/entities/currency.entity.js';
import { Account } from '../../modules/accounts/entities/account.entity.js';
import { ExchangeRate } from '../../modules/exchange-rates/entities/exchange-rate.entity.js';

const currencies = [
  { code: 'DOP', name: 'Dominican Peso', decimalPlaces: 2 },
  { code: 'USD', name: 'US Dollar', decimalPlaces: 2 },
  { code: 'EUR', name: 'Euro', decimalPlaces: 2 },
];

const customers = [
  {
    firstName: 'Carlos',
    lastName: 'Martinez',
    email: 'carlos.martinez@example.com',
    documentNumber: '001555555',
  },
  {
    firstName: 'Maria',
    lastName: 'Rodriguez',
    email: 'maria.rodriguez@example.com',
    documentNumber: '002555555',
  },
  {
    firstName: 'Juan',
    lastName: 'Perez',
    email: 'juan.perez@example.com',
    documentNumber: '003555555',
  },
];

const accounts = [
  { number: 'QIK-000001', document: '001555555', currency: 'DOP' },
  { number: 'QIK-000002', document: '001555555', currency: 'USD' },
  { number: 'QIK-000003', document: '002555555', currency: 'DOP' },
  { number: 'QIK-000004', document: '002555555', currency: 'EUR' },
  { number: 'QIK-000005', document: '003555555', currency: 'USD' },
];

const exchangeRates = [
  { from: 'USD', to: 'DOP', rate: '60.000000000000' },
  { from: 'DOP', to: 'USD', rate: '0.016666666667' },
  { from: 'EUR', to: 'DOP', rate: '70.000000000000' },
  { from: 'DOP', to: 'EUR', rate: '0.014285714286' },
  { from: 'EUR', to: 'USD', rate: '1.166666666667' },
  { from: 'USD', to: 'EUR', rate: '0.857142857143' },
];

const effectiveAt = new Date('2026-10-26T00:00:00.000Z');

async function seed(): Promise<void> {
  await AppDataSource.initialize();

  try {
    await AppDataSource.transaction(async (manager) => {
      const currencyRepo = manager.getRepository(Currency);
      const customerRepo = manager.getRepository(Customer);
      const accountRepo = manager.getRepository(Account);
      const rateRepo = manager.getRepository(ExchangeRate);

      // Currencies
      for (const currency of currencies) {
        await currencyRepo
          .createQueryBuilder()
          .insert()
          .values(currency)
          .orIgnore()
          .execute();
      }

      console.log('Currencies seeded');

      // Customers
      for (const customer of customers) {
        await customerRepo
          .createQueryBuilder()
          .insert()
          .values(customer)
          .orIgnore()
          .execute();
      }

      console.log('Customers seeded');

      // Accounts
      for (const account of accounts) {
        const existing = await accountRepo.findOneBy({
          accountNumber: account.number,
        });

        if (existing) continue;

        const owner = await customerRepo.findOneByOrFail({
          documentNumber: account.document,
        });

        await accountRepo.save(
          accountRepo.create({
            accountNumber: account.number,
            customerId: owner.id,
            currencyCode: account.currency,
            balance: '0.0000',
          }),
        );
      }

      console.log('Accounts seeded');

      // 4. Exchange rates
      for (const rate of exchangeRates) {
        const existing = await rateRepo.findOneBy({
          fromCurrencyCode: rate.from,
          toCurrencyCode: rate.to,
          effectiveAt,
        });

        if (existing) continue;

        await rateRepo.save(
          rateRepo.create({
            fromCurrencyCode: rate.from,
            toCurrencyCode: rate.to,
            rate: rate.rate,
            effectiveAt,
          }),
        );
      }

      console.log('Exchange rates seeded');
    });

    console.log('Data seeding completed');
  } finally {
    await AppDataSource.destroy();
  }
}

seed().catch((error: unknown) => {
  console.error('Seed failed:', error);
  process.exitCode = 1;
});
