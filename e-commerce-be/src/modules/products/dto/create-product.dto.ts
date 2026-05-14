export class CreateProductDto {
  name?: string;
  categoryId?: number;
  description?: string;
  price?: number;
  stock?: number;
  mainImageUrl?: string;
  extraImage1?: string;
  extraImage2?: string;
  extraImage3?: string;
  extraImage4?: string;
  color?: string;
  specifications?: Record<string, any>;
  isActive?: boolean;
  isFeatured?: boolean;
}
