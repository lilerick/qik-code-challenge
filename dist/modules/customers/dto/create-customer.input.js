var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
let CreateCustomerInput = class CreateCustomerInput {
    firstName;
    lastName;
    email;
    documentNumber;
};
__decorate([
    Field(),
    IsString(),
    IsNotEmpty(),
    MaxLength(100),
    __metadata("design:type", String)
], CreateCustomerInput.prototype, "firstName", void 0);
__decorate([
    Field(),
    IsString(),
    IsNotEmpty(),
    MaxLength(100),
    __metadata("design:type", String)
], CreateCustomerInput.prototype, "lastName", void 0);
__decorate([
    Field(),
    IsEmail(),
    MaxLength(255),
    __metadata("design:type", String)
], CreateCustomerInput.prototype, "email", void 0);
__decorate([
    Field(),
    IsString(),
    IsNotEmpty(),
    MaxLength(30),
    __metadata("design:type", String)
], CreateCustomerInput.prototype, "documentNumber", void 0);
CreateCustomerInput = __decorate([
    InputType()
], CreateCustomerInput);
export { CreateCustomerInput };
//# sourceMappingURL=create-customer.input.js.map