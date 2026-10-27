import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

import { TransactionsReindexService } from './transactions-reindex.service.js';

@Injectable()
export class TransactionsSearchSyncService {
  private readonly logger = new Logger(TransactionsSearchSyncService.name);

  private isRunning = false;

  constructor(private readonly reindexService: TransactionsReindexService) {}

  @Interval(60_000)
  async synchronize(): Promise<void> {
    // Avoid overlapping executions in the same NestJS process.
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    try {
      await this.reindexService.execute();

      this.logger.debug('Transaction search synchronization completed');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);

      // A search outage must not stop banking operations.
      this.logger.warn(`Transaction search synchronization failed: ${message}`);
    } finally {
      this.isRunning = false;
    }
  }
}
