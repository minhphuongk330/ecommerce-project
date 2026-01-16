import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { ProductColor } from '../../entities/product-color.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductColor)
    private readonly productColorRepository: Repository<ProductColor>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { colors, ...productData } = createProductDto;
    const product = this.productRepository.create(productData);
    const savedProduct = await this.productRepository.save(product);

    if (colors && colors.length > 0) {
      const colorEntities = colors.map((c) =>
        this.productColorRepository.create({
          ...c,
          productId: savedProduct.id,
        }),
      );
      await this.productColorRepository.save(colorEntities);
    }
    return savedProduct;
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['category', 'reviews', 'reviews.customer', 'productColors'],
      order: { createdAt: 'DESC' },
    });
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
      ],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const { colors, ...updateData } = updateProductDto;
    const product = await this.findOne(id);

    Object.assign(product, updateData);
    const savedProduct = await this.productRepository.save(product);

    if (colors) {
      await this.productColorRepository.delete({ productId: id });

      if (colors.length > 0) {
        const newColors = colors.map((c) =>
          this.productColorRepository.create({
            ...c,
            productId: id,
          }),
        );
        await this.productColorRepository.save(newColors);
      }
    }

    return savedProduct;
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
