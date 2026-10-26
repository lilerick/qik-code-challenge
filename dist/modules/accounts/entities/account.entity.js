var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Check, } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity.js';
import { Currency } from '../../currencies/entities/currency.entity.js';
export var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIVE"] = "ACTIVE";
    AccountStatus["FROZEN"] = "FROZEN";
    AccountStatus["CLOSED"] = "CLOSED";
})(AccountStatus || (AccountStatus = {}));
let Account = class Account {
    id;
    accountNumber;
    customerId;
    customer;
    currencyCode;
    currency;
    balance;
    status;
    createdAt;
    updatedAt;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Account.prototype, "id", void 0);
__decorate([
    Column({
        name: 'account_number',
        type: 'varchar',
        length: 20,
        unique: true,
    }),
    __metadata("design:type", String)
], Account.prototype, "accountNumber", void 0);
__decorate([
    Column({ name: 'customer_id', type: 'uuid' }),
    __metadata("design:type", String)
], Account.prototype, "customerId", void 0);
__decorate([
    ManyToOne(() => Customer, { nullable: false, onDelete: 'RESTRICT' }),
    JoinColumn({ name: 'customer_id' }),
    __metadata("design:type", Customer)
], Account.prototype, "customer", void 0);
__decorate([
    Column({ name: 'currency_code', type: 'varchar', length: 3 }),
    __metadata("design:type", String)
], Account.prototype, "currencyCode", void 0);
__decorate([
    ManyToOne(() => Currency, { nullable: false, onDelete: 'RESTRICT' }),
    JoinColumn({ name: 'currency_code', referencedColumnName: 'code' }),
    __metadata("design:type", Currency)
], Account.prototype, "currency", void 0);
__decorate([
    Column({
        type: 'numeric',
        precision: 19,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", String)
], Account.prototype, "balance", void 0);
__decorate([
    Column({
        type: 'enum',
        enum: AccountStatus,
        enumName: 'account_status_enum',
        default: AccountStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Account.prototype, "status", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Account.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Account.prototype, "updatedAt", void 0);
Account = __decorate([
    Entity('accounts'),
    Check('CHK_accounts_balance_nonnegative', '"balance" >= 0')
], Account);
export { Account };
//# sourceMappingURL=account.entity.js.map