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
import { IsIn, IsUUID } from 'class-validator';
let CreateAccountInput = class CreateAccountInput {
    customerId;
    currencyCode;
};
__decorate([
    Field(() => ID),
    IsUUID(),
    __metadata("design:type", String)
], CreateAccountInput.prototype, "customerId", void 0);
__decorate([
    Field(),
    IsIn(['DOP', 'USD', 'EUR']),
    __metadata("design:type", String)
], CreateAccountInput.prototype, "currencyCode", void 0);
CreateAccountInput = __decorate([
    InputType()
], CreateAccountInput);
export { CreateAccountInput };
//# sourceMappingURL=create-account.input.js.map