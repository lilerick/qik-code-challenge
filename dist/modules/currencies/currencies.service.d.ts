import { Repository } from 'typeorm';
import { Currency } from './entities/currency.entity.js';
import { RedisCacheService } from '../../infrastructure/cache/redis-cache.service.js';
export declare class CurrenciesService {
    private readonly currenciesRepository;
    private readonly cacheService;
    private readonly logger;
    private readonly cacheKey;
    private readonly cacheTtl;
    constructor(currenciesRepository: Repository<Currency>, cacheService: RedisCacheService);
    findActive(): Promise<Currency[]>;
}
