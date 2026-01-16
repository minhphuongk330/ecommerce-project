import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductReview } from '../../entities/product-review.entity';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';

@Injectable()
export class ProductReviewsService {
  constructor(
    @InjectRepository(ProductReview)
    private readonly productReviewRepository: Repository<ProductReview>,
  ) {}

  async create(
    createProductReviewDto: CreateProductReviewDto,
    customerId: number,
  ): Promise<ProductReview> {
    const { productId, rating, comment } = createProductReviewDto;

    // Validate rating is between 1-5
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5 stars');
    }

    // Check if customer already reviewed this product
    const existingReview = await this.productReviewRepository.findOne({
      where: { productId, customerId },
    });

    if (existingReview) {
      throw new ConflictException(
        'You have already reviewed this product. Each customer can only review a product once.',
      );
    }

    const review = this.productReviewRepository.create({
      productId,
      customerId,
      rating,
      comment,
    });

    return await this.productReviewRepository.save(review);
  }

  async findAll(productId?: number): Promise<ProductReview[]> {
    const where = productId ? { productId } : {};
    return await this.productReviewRepository.find({
      where,
      relations: ['customer', 'product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByProductId(productId: number): Promise<ProductReview[]> {
    return await this.productReviewRepository.find({
      where: { productId },
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ProductReview> {
    const review = await this.productReviewRepository.findOne({
      where: { id },
      relations: ['customer', 'product'],
    });
    if (!review) {
      throw new NotFoundException(`Product review with ID ${id} not found`);
    }
    return review;
  }

  async update(
    id: number,
    updateProductReviewDto: UpdateProductReviewDto,
    customerId: number,
  ): Promise<ProductReview> {
    const review = await this.findOne(id);

    // Check if the review belongs to the customer
    if (review.customerId !== customerId) {
      throw new ForbiddenException(
        'You can only update your own reviews',
      );
    }

    // Validate rating if provided
    if (updateProductReviewDto.rating !== undefined) {
      if (updateProductReviewDto.rating < 1 || updateProductReviewDto.rating > 5) {
        throw new BadRequestException('Rating must be between 1 and 5 stars');
      }
    }

    Object.assign(review, updateProductReviewDto);
    return await this.productReviewRepository.save(review);
  }

  async remove(id: number, customerId: number): Promise<void> {
    const review = await this.findOne(id);

    // Check if the review belongs to the customer
    if (review.customerId !== customerId) {
      throw new ForbiddenException(
        'You can only delete your own reviews',
      );
    }

    await this.productReviewRepository.remove(review);
  }
}

