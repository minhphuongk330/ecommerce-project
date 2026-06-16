export class CreateOrderItemDto {
  orderId: number;
  productId: number;
  colorId?: string;
  unitPrice: number;
  quantity?: number;
  variantId?: number;
  skipStockDecrement?: boolean;
}


