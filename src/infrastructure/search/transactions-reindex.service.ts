import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Transaction } from '../../modules/transactions/entities/transaction.entity.js';
import { SearchService } from './search.service.js';

@Injectable()
export class TransactionsReindexService {
  private readonly logger = new Logger(TransactionsReindexService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    private readonly searchService: SearchService,
  ) {}

  async execute(): Promise<number> {
    await this.searchService.ensureIndex();

    const batchSize = 100;
    let processed = 0;

    while (true) {
      const transactions = await this.transactionsRepository.find({
        order: { createdAt: 'ASC', id: 'ASC' },
        skip: processed,
        take: batchSize,
      });

      if (transactions.length === 0) {
        break;
      }

      for (const transaction of transactions) {
        await this.searchService.indexTransaction(transaction);
        processed++;
      }

      this.logger.log(`Indexed ${processed} transactions`);

      if (transactions.length < batchSize) {
        break;
      }
    }

    this.logger.log(`Reindex completed: ${processed} transactions`);

    return processed;
  }
}
