export declare enum AddressType {
    SHIPPING = "SHIPPING",
    BILLING = "BILLING"
}
export declare class CreateAddressDto {
    label?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
    isDefault?: boolean;
    addressType?: AddressType;
}
