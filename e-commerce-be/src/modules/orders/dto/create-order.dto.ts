export class OrderItemDto {
  productId: number;
  quantity: number;
  unitPrice: number;
  colorId?: string;
  variantId?: number; 
}

export class CreateOrderDto {
  orderNo: string;
  customerId?: number;
  addressId: number;
  status?: string;
  discount?: number;
  totalAmount?: number;
  note?: string;
  orderItems?: OrderItemDto[]; 
}