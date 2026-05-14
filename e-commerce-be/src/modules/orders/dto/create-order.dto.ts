export class OrderItemDto {
  productId: number;
  quantity: number;
  unitPrice: number;
  colorId?: string;
}

export class CreateOrderDto {
  orderNo: string;
  customerId?: number;
  addressId: number;
  status?: string;
  discount?: number;
  shippingDiscount?: number;
  totalAmount?: number;
  note?: string;
  orderItems?: OrderItemDto[];
  subtotal?: number;
  taxAmount?: number;
  shippingCost?: number;
  scheduleDeliveryDate?: string;
  // Payment
  paymentMethod?: 'COD' | 'VNPAY';
  appliedCouponCode?: string;
  appliedShippingCouponCode?: string;
}