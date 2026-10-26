var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Index, Check, } from 'typeorm';
import { Currency } from '../../currencies/entities/currency.entity.js';
let ExchangeRate = class ExchangeRate {
    id;
    fromCurrencyCode;
    fromCurrency;
    toCurrencyCode;
    toCurrency;
    rate;
    effectiveAt;
    createdAt;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], ExchangeRate.prototype, "id", void 0);
__decorate([
    Column({
        name: 'from_currency_code',
        type: 'varchar',
        length: 3,
    }),
    __metadata("design:type", String)
], ExchangeRate.prototype, "fromCurrencyCode", void 0);
__decorate([
    ManyToOne(() => Currency, { nullable: false, onDelete: 'RESTRICT' }),
    JoinColumn({
        name: 'from_currency_code',
        referencedColumnName: 'code',
    }),
    __metadata("design:type", Currency)
], ExchangeRate.prototype, "fromCurrency", void 0);
__decorate([
    Column({
        name: 'to_currency_code',
        type: 'varchar',
        length: 3,
    }),
    __metadata("design:type", String)
], ExchangeRate.prototype, "toCurrencyCode", void 0);
__decorate([
    ManyToOne(() => Currency, { nullable: false, onDelete: 'RESTRICT' }),
    JoinColumn({
        name: 'to_currency_code',
        referencedColumnName: 'code',
    }),
    __metadata("design:type", Currency)
], ExchangeRate.prototype, "toCurrency", void 0);
__decorate([
    Column({
        type: 'numeric',
        precision: 24,
        scale: 12,
    }),
    __metadata("design:type", String)
], ExchangeRate.prototype, "rate", void 0);
__decorate([
    Column({
        name: 'effective_at',
        type: 'timestamptz',
    }),
    __metadata("design:type", Date)
], ExchangeRate.prototype, "effectiveAt", void 0);
__decorate([
    CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
    }),
    __metadata("design:type", Date)
], ExchangeRate.prototype, "createdAt", void 0);
ExchangeRate = __decorate([
    Entity('exchange_rates'),
    Index('IDX_exchange_rates_pair_effective', [
        'fromCurrencyCode',
        'toCurrencyCode',
        'effectiveAt',
    ]),
    Check('CHK_exchange_rates_positive', '"rate" > 0'),
    Check('CHK_exchange_rates_different_currencies', '"from_currency_code" <> "to_currency_code"')
], ExchangeRate);
export { ExchangeRate };
//# sourceMappingURL=exchange-rate.entity.js.map