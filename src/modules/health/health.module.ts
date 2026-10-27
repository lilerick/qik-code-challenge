import { Module } from '@nestjs/common';

import { SearchModule } from '../../infrastructure/search/search.module.js';
import { HealthController } from './health.controller.js';
import { HealthService } from './health.service.js';

@Module({
  imports: [SearchModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
