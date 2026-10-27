import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

import { SearchService } from './search.service.js';

@Module({
  imports: [
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
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
