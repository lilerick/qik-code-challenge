import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { AppModule } from './app.module.js';

async function bootstrap() {
  const isTest = process.env.NODE_ENV === 'test';

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Prevent integration tests from using the production/development DB.
  if (isTest) {
    const dataSource = app.get(DataSource);

    const result = (await dataSource.query(
      'SELECT current_database() AS database_name',
    )) as Array<{ database_name: string }>;

    const actualDatabase = result[0]?.database_name;

    if (actualDatabase !== 'qik_banking_test') {
      throw new Error(
        `Unsafe test database: expected qik_banking_test, received ${actualDatabase}`,
      );
    }
  }

  const port = Number(process.env.PORT ?? 3000);

  if (isTest && port !== 3001) {
    throw new Error('Integration test server must run on port 3001');
  }

  await app.listen(port);
}

await bootstrap();
