var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID, IsString, Matches } from 'class-validator';
let DepositInput = class DepositInput {
    accountId;
    amount;
    idempotencyKey;
};
__decorate([
    Field(() => ID),
    IsUUID(),
    __metadata("design:type", String)
], DepositInput.prototype, "accountId", void 0);
__decorate([
    Field(),
    IsString(),
    Matches(/^(?:0|[1-9]\d{0,14})(?:\.\d{1,4})?$/, {
        message: 'Amount must be a positive-format decimal with up to 4 decimal places',
    }),
    __metadata("design:type", String)
], DepositInput.prototype, "amount", void 0);
__decorate([
    Field(() => ID),
    IsUUID(),
    __metadata("design:type", String)
], DepositInput.prototype, "idempotencyKey", void 0);
DepositInput = __decorate([
    InputType()
], DepositInput);
export { DepositInput };
//# sourceMappingURL=deposit.input.js.map