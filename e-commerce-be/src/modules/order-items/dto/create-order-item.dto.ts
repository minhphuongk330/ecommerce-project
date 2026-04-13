export class CreateOrderItemDto {
  orderId: number;
  productId: number;
  variantId?: number;
  colorId?: string;
  unitPrice: number;
  quantity?: number;
}

