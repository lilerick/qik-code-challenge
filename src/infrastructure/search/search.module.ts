import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transaction } from '../../modules/transactions/entities/transaction.entity.js';

import { SearchService } from './search.service.js';
import { TransactionsReindexService } from './transactions-reindex.service.js';
import { TransactionsSearchSyncService } from './transactions-search-sync.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    ElasticsearchModule.registerAsync({
      useFactory: () => {
        const node = process.env.ELASTICSEARCH_NODE;

        if (!node) {
          throw new Error('ELASTICSEARCH_NODE is not configured');
        }

        return {
          node,
          requestTimeout: 3000,
          maxRetries: 1,
        };
      },
    }),
  ],
  providers: [
    SearchService,
    TransactionsReindexService,
    TransactionsSearchSyncService,
  ],
  exports: [SearchService, TransactionsReindexService],
})
export class SearchModule {}
