import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductReviewsService } from './product-reviews.service';
import { ProductReviewsController } from './product-reviews.controller';
import { ProductReview } from '../../entities/product-review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductReview])],
  controllers: [ProductReviewsController],
  providers: [ProductReviewsService],
  exports: [ProductReviewsService],
})
export class ProductReviewsModule {}

