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
import { CustomerStatus } from '../entities/customer.entity.js';
let CustomerModel = class CustomerModel {
    id;
    firstName;
    lastName;
    email;
    documentNumber;
    status;
    createdAt;
    updatedAt;
};
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], CustomerModel.prototype, "id", void 0);
__decorate([
    Field(),
    __metadata("design:type", String)
], CustomerModel.prototype, "firstName", void 0);
__decorate([
    Field(),
    __metadata("design:type", String)
], CustomerModel.prototype, "lastName", void 0);
__decorate([
    Field(),
    __metadata("design:type", String)
], CustomerModel.prototype, "email", void 0);
__decorate([
    Field(),
    __metadata("design:type", String)
], CustomerModel.prototype, "documentNumber", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], CustomerModel.prototype, "status", void 0);
__decorate([
    Field(),
    __metadata("design:type", Date)
], CustomerModel.prototype, "createdAt", void 0);
__decorate([
    Field(),
    __metadata("design:type", Date)
], CustomerModel.prototype, "updatedAt", void 0);
CustomerModel = __decorate([
    ObjectType()
], CustomerModel);
export { CustomerModel };
//# sourceMappingURL=customer.model.js.map