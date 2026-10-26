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
import { Account } from '../../accounts/entities/account.entity.js';
import { Currency } from '../../currencies/entities/currency.entity.js';
export var TransactionType;
(function (TransactionType) {
    TransactionType["DEPOSIT"] = "DEPOSIT";
    TransactionType["WITHDRAWAL"] = "WITHDRAWAL";
    TransactionType["TRANSFER"] = "TRANSFER";
})(TransactionType || (TransactionType = {}));
export var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["COMPLETED"] = "COMPLETED";
    TransactionStatus["REVERSED"] = "REVERSED";
})(TransactionStatus || (TransactionStatus = {}));
let Transaction = class Transaction {
    id;
    type;
    status;
    sourceAccountId;
    sourceAccount;
    destinationAccountId;
    destinationAccount;
    amount;
    currencyCode;
    currency;
    destinationAmount;
    destinationCurrencyCode;
    destinationCurrency;
    exchangeRateApplied;
    idempotencyKey;
    createdAt;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Transaction.prototype, "id", void 0);
__decorate([
    Column({
        type: 'enum',
        enum: TransactionType,
        enumName: 'transaction_type_enum',
    }),
    __metadata("design:type", String)
], Transaction.prototype, "type", void 0);
__decorate([
    Column({
        type: 'enum',
        enum: TransactionStatus,
        enumName: 'transaction_status_enum',
        default: TransactionStatus.COMPLETED,
    }),
    __metadata("design:type", String)
], Transaction.prototype, "status", void 0);
__decorate([
    Column({
        name: 'source_account_id',
        type: 'uuid',
        nullable: true,
    }),
    __metadata("design:type", Object)
], Transaction.prototype, "sourceAccountId", void 0);
__decorate([
    ManyToOne(() => Account, {
        nullable: true,
        onDelete: 'RESTRICT',
    }),
    JoinColumn({ name: 'source_account_id' }),
    __metadata("design:type", Object)
], Transaction.prototype, "sourceAccount", void 0);
__decorate([
    Column({
        name: 'destination_account_id',
        type: 'uuid',
        nullable: true,
    }),
    __metadata("design:type", Object)
], Transaction.prototype, "destinationAccountId", void 0);
__decorate([
    ManyToOne(() => Account, {
        nullable: true,
        onDelete: 'RESTRICT',
    }),
    JoinColumn({ name: 'destination_account_id' }),
    __metadata("design:type", Object)
], Transaction.prototype, "destinationAccount", void 0);
__decorate([
    Column({
        type: 'numeric',
        precision: 19,
        scale: 4,
    }),
    __metadata("design:type", String)
], Transaction.prototype, "amount", void 0);
__decorate([
    Column({
        name: 'currency_code',
        type: 'varchar',
        length: 3,
    }),
    __metadata("design:type", String)
], Transaction.prototype, "currencyCode", void 0);
__decorate([
    ManyToOne(() => Currency, {
        nullable: false,
        onDelete: 'RESTRICT',
    }),
    JoinColumn({
        name: 'currency_code',
        referencedColumnName: 'code',
    }),
    __metadata("design:type", Currency)
], Transaction.prototype, "currency", void 0);
__decorate([
    Column({
        name: 'destination_amount',
        type: 'numeric',
        precision: 19,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Transaction.prototype, "destinationAmount", void 0);
__decorate([
    Column({
        name: 'destination_currency_code',
        type: 'varchar',
        length: 3,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Transaction.prototype, "destinationCurrencyCode", void 0);
__decorate([
    ManyToOne(() => Currency, {
        nullable: true,
        onDelete: 'RESTRICT',
    }),
    JoinColumn({
        name: 'destination_currency_code',
        referencedColumnName: 'code',
    }),
    __metadata("design:type", Object)
], Transaction.prototype, "destinationCurrency", void 0);
__decorate([
    Column({
        name: 'exchange_rate_applied',
        type: 'numeric',
        precision: 24,
        scale: 12,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Transaction.prototype, "exchangeRateApplied", void 0);
__decorate([
    Index('UQ_transactions_idempotency_key', { unique: true }),
    Column({
        name: 'idempotency_key',
        type: 'uuid',
    }),
    __metadata("design:type", String)
], Transaction.prototype, "idempotencyKey", void 0);
__decorate([
    CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
    }),
    __metadata("design:type", Date)
], Transaction.prototype, "createdAt", void 0);
Transaction = __decorate([
    Entity('transactions'),
    Check('CHK_transactions_currency_fields', `(
    (
      "type" IN ('DEPOSIT', 'WITHDRAWAL')
      AND "destination_amount" IS NULL
      AND "destination_currency_code" IS NULL
      AND "exchange_rate_applied" IS NULL
    )
    OR
    (
      "type" = 'TRANSFER'
      AND "destination_amount" IS NOT NULL
      AND "destination_currency_code" IS NOT NULL
      AND (
        (
          "currency_code" = "destination_currency_code"
          AND "exchange_rate_applied" IS NULL
        )
        OR
        (
          "currency_code" <> "destination_currency_code"
          AND "exchange_rate_applied" IS NOT NULL
        )
      )
    )
  )`),
    Check('CHK_transactions_positive_amount', '"amount" > 0'),
    Check('CHK_transactions_destination_amount', '"destination_amount" IS NULL OR "destination_amount" > 0'),
    Check('CHK_transactions_exchange_rate', '"exchange_rate_applied" IS NULL OR "exchange_rate_applied" > 0'),
    Check('CHK_transactions_accounts', `(
    ("type" = 'DEPOSIT'
      AND "source_account_id" IS NULL
      AND "destination_account_id" IS NOT NULL)
    OR
    ("type" = 'WITHDRAWAL'
      AND "source_account_id" IS NOT NULL
      AND "destination_account_id" IS NULL)
    OR
    ("type" = 'TRANSFER'
      AND "source_account_id" IS NOT NULL
      AND "destination_account_id" IS NOT NULL
      AND "source_account_id" <> "destination_account_id")
  )`),
    Index('IDX_transactions_source_created', ['sourceAccountId', 'createdAt']),
    Index('IDX_transactions_destination_created', [
        'destinationAccountId',
        'createdAt',
    ])
], Transaction);
export { Transaction };
//# sourceMappingURL=transaction.entity.js.map