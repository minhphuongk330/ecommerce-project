export class CreateProductReviewDto {
  productId: number;
  rating: number; // 1-5 stars
  comment?: string;
}

