export class CreateCustomerAddressDto {
  customerId: number;
  receiverName?: string;
  phone?: string;
  address: string;
  isDefault?: boolean;
}

