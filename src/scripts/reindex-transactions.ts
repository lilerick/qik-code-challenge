import { NestFactory } from '@nestjs/core';

import { AppModule } from '../app.module.js';
import { TransactionsReindexService } from '../infrastructure/search/transactions-reindex.service.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  try {
    const reindexService = app.get(TransactionsReindexService);

    console.log('Starting transaction reindex...');

    const total = await reindexService.execute();

    console.log(`Reindex completed successfully: ${total} transactions`);
  } finally {
    await app.close();
  }
}

bootstrap().catch((error: unknown) => {
  console.error('Transaction reindex failed:', error);
  process.exitCode = 1;
});
