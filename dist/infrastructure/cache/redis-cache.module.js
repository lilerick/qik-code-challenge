var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Logger, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyvNonBlocking } from '@keyv/redis';
import { RedisCacheService } from './redis-cache.service.js';
const logger = new Logger('RedisCache');
let RedisCacheModule = class RedisCacheModule {
};
RedisCacheModule = __decorate([
    Module({
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
                    redisStore.on('error', (error) => {
                        const now = Date.now();
                        if (now - lastWarningAt < warningIntervalMs) {
                            return;
                        }
                        lastWarningAt = now;
                        const message = error instanceof Error ? error.message : String(error);
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
], RedisCacheModule);
export { RedisCacheModule };
//# sourceMappingURL=redis-cache.module.js.map