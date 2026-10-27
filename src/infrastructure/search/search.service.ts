import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import type { Transaction } from '../../modules/transactions/entities/transaction.entity.js';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly indexName = 'banking-transactions-v1';

  constructor(private readonly elasticsearch: ElasticsearchService) {}

  async ping(): Promise<boolean> {
    return this.elasticsearch.ping();
  }

  async ensureIndex(): Promise<void> {
    const exists = await this.elasticsearch.indices.exists({
      index: this.indexName,
    });

    if (exists) {
      this.logger.debug('Transaction search index already exists');
      return;
    }

    await this.elasticsearch.indices.create({
      index: this.indexName,
      settings: {
        number_of_shards: 1,
        number_of_replicas: 0,
      },
      mappings: {
        dynamic: 'strict',
        properties: {
          id: { type: 'keyword' },
          type: { type: 'keyword' },
          status: { type: 'keyword' },

          sourceAccountId: { type: 'keyword' },
          destinationAccountId: { type: 'keyword' },

          amount: { type: 'keyword' },
          currencyCode: { type: 'keyword' },

          destinationAmount: { type: 'keyword' },
          destinationCurrencyCode: { type: 'keyword' },
          exchangeRateApplied: { type: 'keyword' },

          createdAt: { type: 'date' },
        },
      },
    });

    this.logger.log('Transaction search index created');
  }

  async indexTransaction(transaction: Transaction): Promise<void> {
    await this.elasticsearch.index({
      index: this.indexName,
      id: transaction.id,
      document: {
        id: transaction.id,
        type: transaction.type,
        status: transaction.status,

        sourceAccountId: transaction.sourceAccountId,
        destinationAccountId: transaction.destinationAccountId,

        amount: transaction.amount,
        currencyCode: transaction.currencyCode,

        destinationAmount: transaction.destinationAmount,
        destinationCurrencyCode: transaction.destinationCurrencyCode,
        exchangeRateApplied: transaction.exchangeRateApplied,

        createdAt: transaction.createdAt,
      },
    });
  }
}
