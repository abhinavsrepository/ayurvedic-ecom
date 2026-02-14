import { AddressType } from './create-address.dto';
export declare class UpdateAddressDto {
    label?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    isDefault?: boolean;
    addressType?: AddressType;
}
