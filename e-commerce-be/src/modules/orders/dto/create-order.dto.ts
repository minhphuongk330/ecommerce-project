export class CreateOrderDto {
  orderNo: string;
  customerId?: number;
  addressId: number;
  status?: string;
  discount?: number;
  totalAmount?: number;
  note?: string;
}

