export class CreateProductImageDto {
  productId: number;
  url: string;
  ordinal?: number;
  isPrimary?: boolean;
}

