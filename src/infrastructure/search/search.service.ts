import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import type { SearchTransactionsInput } from '../../modules/transactions/dto/search-transactions.input.js';
import type { TransactionModel } from '../../modules/transactions/models/transaction.model.js';
import type { estypes } from '@elastic/elasticsearch';

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

  async searchTransactions(
    input: SearchTransactionsInput,
  ): Promise<TransactionModel[]> {
    const filters: estypes.QueryDslQueryContainer[] = [];

    if (input.accountId) {
      filters.push({
        bool: {
          should: [
            { term: { sourceAccountId: input.accountId } },
            { term: { destinationAccountId: input.accountId } },
          ],
          minimum_should_match: 1,
        },
      });
    }

    if (input.type) {
      filters.push({ term: { type: input.type } });
    }

    if (input.currencyCode) {
      filters.push({
        term: { currencyCode: input.currencyCode.toUpperCase() },
      });
    }

    if (input.fromDate || input.toDate) {
      filters.push({
        range: {
          createdAt: {
            ...(input.fromDate ? { gte: input.fromDate } : {}),
            ...(input.toDate ? { lte: input.toDate } : {}),
          },
        },
      });
    }

    const response = await this.elasticsearch.search({
      index: this.indexName,
      from: input.offset,
      size: input.limit,
      query: filters.length ? { bool: { filter: filters } } : { match_all: {} },
      sort: [{ createdAt: { order: 'desc' } }, { id: { order: 'desc' } }],
    });

    return response.hits.hits
      .filter((hit) => hit._source != null)
      .map((hit) => {
        const source = hit._source as Record<string, unknown>;

        return {
          id: String(source.id),
          type: source.type,
          status: source.status,
          sourceAccountId: source.sourceAccountId ?? null,
          destinationAccountId: source.destinationAccountId ?? null,
          amount: String(source.amount),
          currencyCode: String(source.currencyCode),
          destinationAmount: source.destinationAmount ?? null,
          destinationCurrencyCode: source.destinationCurrencyCode ?? null,
          exchangeRateApplied: source.exchangeRateApplied ?? null,
          createdAt: new Date(String(source.createdAt)),
        } as TransactionModel;
      });
  }
}
