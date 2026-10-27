import type { Cache } from 'cache-manager';
export declare class RedisCacheService {
    private readonly cacheManager;
    constructor(cacheManager: Cache);
    get<T>(key: string): Promise<T | undefined>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    delete(key: string): Promise<void>;
}
