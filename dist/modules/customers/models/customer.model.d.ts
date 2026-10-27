import { CustomerStatus } from '../entities/customer.entity.js';
export declare class CustomerModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    documentNumber: string;
    status: CustomerStatus;
    createdAt: Date;
    updatedAt: Date;
}
