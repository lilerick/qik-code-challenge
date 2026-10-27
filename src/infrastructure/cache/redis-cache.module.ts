import { Logger, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyvNonBlocking } from '@keyv/redis';

import { RedisCacheService } from './redis-cache.service.js';

const logger = new Logger('RedisCache');

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => {
        const redisUrl = process.env.REDIS_URL;

        if (!redisUrl) {
          throw new Error('REDIS_URL is not configured');
        }

        const redisStore = createKeyvNonBlocking(redisUrl, {
          connectionTimeout: 1000,
        });

        let lastWarningAt = 0;
        const warningIntervalMs = 30_000;

        redisStore.on('error', (error: unknown) => {
          const now = Date.now();

          if (now - lastWarningAt < warningIntervalMs) {
            return;
          }

          lastWarningAt = now;

          const message =
            error instanceof Error ? error.message : String(error);

          logger.warn(`Redis unavailable: ${message}`);
        });

        return {
          stores: [redisStore],
          ttl: 60_000,
        };
      },
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
