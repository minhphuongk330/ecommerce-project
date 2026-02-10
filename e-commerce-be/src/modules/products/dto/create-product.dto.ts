export class CreateProductColorDto {
  colorName: string;
  colorHex?: string;
}

export class CreateProductVariantDto {
  price: number;
  stock: number;
  sku?: string;
  options: any;
  imageUrl?: string;
}

export class CreateProductDto {
  name?: string;
  categoryId?: number;
  shortDescription?: string;
  description?: string;
  price?: number;
  stock?: number;
  mainImageUrl?: string;
  extraImage1?: string;
  extraImage2?: string;
  extraImage3?: string;
  extraImage4?: string;
  isActive?: boolean;
  attributes?: any;
  colors?: CreateProductColorDto[];
  variants?: CreateProductVariantDto[];
}
