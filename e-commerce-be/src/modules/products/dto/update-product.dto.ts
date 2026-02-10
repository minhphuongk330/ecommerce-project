import {
  CreateProductColorDto,
  CreateProductVariantDto,
} from './create-product.dto';

export class UpdateProductDto {
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
