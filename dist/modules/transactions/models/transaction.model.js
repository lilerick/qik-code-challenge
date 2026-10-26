var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TransactionStatus, TransactionType, } from '../entities/transaction.entity.js';
let TransactionModel = class TransactionModel {
    id;
    type;
    status;
    sourceAccountId;
    destinationAccountId;
    amount;
    currencyCode;
    destinationAmount;
    destinationCurrencyCode;
    exchangeRateApplied;
    idempotencyKey;
    createdAt;
};
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], TransactionModel.prototype, "id", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], TransactionModel.prototype, "type", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], TransactionModel.prototype, "status", void 0);
__decorate([
    Field(() => ID, { nullable: true }),
    __metadata("design:type", Object)
], TransactionModel.prototype, "sourceAccountId", void 0);
__decorate([
    Field(() => ID, { nullable: true }),
    __metadata("design:type", Object)
], TransactionModel.prototype, "destinationAccountId", void 0);
__decorate([
    Field(),
    __metadata("design:type", String)
], TransactionModel.prototype, "amount", void 0);
__decorate([
    Field(),
    __metadata("design:type", String)
], TransactionModel.prototype, "currencyCode", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", Object)
], TransactionModel.prototype, "destinationAmount", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", Object)
], TransactionModel.prototype, "destinationCurrencyCode", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", Object)
], TransactionModel.prototype, "exchangeRateApplied", void 0);
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], TransactionModel.prototype, "idempotencyKey", void 0);
__decorate([
    Field(),
    __metadata("design:type", Date)
], TransactionModel.prototype, "createdAt", void 0);
TransactionModel = __decorate([
    ObjectType()
], TransactionModel);
export { TransactionModel };
//# sourceMappingURL=transaction.model.js.map