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

    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Đánh giá phải từ 1 đến 5 sao');
    }

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

  async findTop(limit = 10): Promise<ProductReview[]> {
    return await this.productReviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.customer', 'customer')
      .leftJoinAndSelect('review.product', 'product')
      .where('review.rating = :rating', { rating: 5 })
      .andWhere('review.comment IS NOT NULL')
      .andWhere("review.comment != ''")
      .andWhere('LENGTH(review.comment) >= :minLen', { minLen: 20 })
      .addSelect('LENGTH(review.comment)', 'commentLen')
      .orderBy('commentLen', 'DESC')
      .addOrderBy('review.createdAt', 'DESC')
      .take(limit)
      .getMany();
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
      throw new NotFoundException(`Không tìm thấy đánh giá sản phẩm với ID ${id}`);
    }
    return review;
  }

  async update(
    id: number,
    updateProductReviewDto: UpdateProductReviewDto,
    customerId: number,
  ): Promise<ProductReview> {
    const review = await this.findOne(id);

    if (review.customerId !== customerId) {
      throw new ForbiddenException('Bạn chỉ có thể cập nhật đánh giá của chính mình');
    }

    if (updateProductReviewDto.rating !== undefined) {
      if (
        updateProductReviewDto.rating < 1 ||
        updateProductReviewDto.rating > 5
      ) {
        throw new BadRequestException('Đánh giá phải từ 1 đến 5 sao');
      }
    }

    Object.assign(review, updateProductReviewDto);
    return await this.productReviewRepository.save(review);
  }

  async remove(id: number, customerId: number): Promise<void> {
    const review = await this.findOne(id);

    if (review.customerId !== customerId) {
      throw new ForbiddenException('Bạn chỉ có thể xoá đánh giá của chính mình');
    }

    await this.productReviewRepository.remove(review);
  }
}
