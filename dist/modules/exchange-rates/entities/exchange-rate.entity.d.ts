import { Currency } from '../../currencies/entities/currency.entity.js';
export declare class ExchangeRate {
    id: string;
    fromCurrencyCode: string;
    fromCurrency: Currency;
    toCurrencyCode: string;
    toCurrency: Currency;
    rate: string;
    effectiveAt: Date;
    createdAt: Date;
}
