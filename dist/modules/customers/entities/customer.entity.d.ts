export declare enum CustomerStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
export declare class Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    documentNumber: string;
    status: CustomerStatus;
    createdAt: Date;
    updatedAt: Date;
}
