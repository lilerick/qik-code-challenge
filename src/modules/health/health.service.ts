import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SearchService } from '../../infrastructure/search/search.service.js';

@Injectable()
export class HealthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly searchService: SearchService,
  ) {}

  async check() {
    const checks = await Promise.allSettled([
      this.dataSource.query('SELECT 1') as Promise<unknown>,
      this.searchService.ping(),
    ]);

    const postgres = checks[0].status === 'fulfilled';
    const elasticsearch =
      checks[1].status === 'fulfilled' && checks[1].value === true;

    return {
      status: postgres ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        postgres: postgres ? 'up' : 'down',
        elasticsearch: elasticsearch ? 'up' : 'down',
      },
    };
  }
}
