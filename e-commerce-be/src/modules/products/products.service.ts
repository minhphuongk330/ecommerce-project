import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductColor } from '../../entities/product-color.entity';
import { Product } from '../../entities/product.entity';
import { ProductVariant } from '../../entities/product-variant.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductColor)
    private readonly productColorRepository: Repository<ProductColor>,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
  ) {}

  async findAll(options?: {
    sort?: string;
    categoryId?: number;
    name?: string;
    page?: number;
    limit?: number;
    collection?: string;
  }): Promise<{ items: Product[]; total: number }> {
    const {
      sort = 'newest',
      categoryId,
      name,
      page = 1,
      limit = 9,
      collection,
    } = options || {};

    if (collection === 'New Arrival') {
      const query = this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.productColors', 'productColors')
        .leftJoinAndSelect('product.variants', 'variants')
        .orderBy('product.createdAt', 'DESC')
        .take(limit);
      const items = await query.getMany();
      return { items, total: items.length };
    }

    if (collection === 'Bestseller') {
      const items = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.productColors', 'productColors')
        .leftJoinAndSelect('product.variants', 'variants')
        .addSelect(
          (sub) =>
            sub
              .select('COALESCE(SUM(oi.quantity), 0)', 'totalSold')
              .from('order_items', 'oi')
              .where('oi.product_id = product.id'),
          'totalSold',
        )
        .orderBy('totalSold', 'DESC')
        .take(limit)
        .getMany();
      return { items, total: items.length };
    }

    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.productColors', 'productColors')
      .leftJoinAndSelect('product.variants', 'variants');

    if (name) {
      query.andWhere('product.name LIKE :name', { name: `%${name}%` });
    }

    if (categoryId) {
      query.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (collection === 'Featured Products') {
      query.andWhere('product.isFeatured = :isFeatured', { isFeatured: true });
    }

    switch (sort) {
      case 'price_asc':
        query.orderBy('product.price', 'ASC');
        break;
      case 'price_desc':
        query.orderBy('product.price', 'DESC');
        break;
      case 'rating':
        query
          .addSelect((sub) => {
            return sub
              .select('COALESCE(AVG(r.rating), 0)', 'avgRating')
              .from('product_reviews', 'r')
              .where('r.product_id = product.id');
          }, 'avgRating')
          .orderBy('avgRating', 'DESC');
        break;
      default:
        query.orderBy('product.createdAt', 'DESC');
    }

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();
    return { items, total };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: [
        'category',
        'productImages',
        'productColors',
        'reviews',
        'reviews.customer',
        'variants',
      ],
    });
    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { colors, variants, ...productData } = createProductDto;
    const product = this.productRepository.create(productData);
    const savedProduct = await this.productRepository.save(product);
    if (colors?.length) {
      const colorEntities = colors.map((c) =>
        this.productColorRepository.create({
          ...c,
          productId: savedProduct.id,
        }),
      );
      await this.productColorRepository.save(colorEntities);
    }
    if (variants?.length) {
      const variantEntities = variants.map((v) =>
        this.productVariantRepository.create({
          ...v,
          productId: savedProduct.id,
        }),
      );
      await this.productVariantRepository.save(variantEntities);
    }
    return savedProduct;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const { colors, variants, ...updateData } = updateProductDto;
    const product = await this.findOne(id);
    Object.assign(product, updateData);
    await this.productRepository.save(product);
    if (colors) {
      await this.productColorRepository.delete({ productId: id });
      if (colors.length)
        await this.productColorRepository.save(
          colors.map((c) =>
            this.productColorRepository.create({ ...c, productId: id }),
          ),
        );
    }
    if (variants) {
      await this.productVariantRepository.delete({ productId: id });
      if (variants.length)
        await this.productVariantRepository.save(
          variants.map((v) =>
            this.productVariantRepository.create({ ...v, productId: id }),
          ),
        );
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
