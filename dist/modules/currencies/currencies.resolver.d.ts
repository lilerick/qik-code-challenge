import { CurrenciesService } from './currencies.service.js';
import { CurrencyModel } from './models/currency.model.js';
export declare class CurrenciesResolver {
    private readonly currenciesService;
    constructor(currenciesService: CurrenciesService);
    findActive(): Promise<CurrencyModel[]>;
}
