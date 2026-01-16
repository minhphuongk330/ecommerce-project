import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from '../../entities/product-image.entity';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async create(
    createProductImageDto: CreateProductImageDto,
  ): Promise<ProductImage> {
    const productImage =
      this.productImageRepository.create(createProductImageDto);
    return await this.productImageRepository.save(productImage);
  }

  async findAll(): Promise<ProductImage[]> {
    return await this.productImageRepository.find({
      relations: ['product'],
      order: { ordinal: 'ASC' },
    });
  }

  async findOne(id: number): Promise<ProductImage> {
    const productImage = await this.productImageRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!productImage) {
      throw new NotFoundException(`ProductImage with ID ${id} not found`);
    }
    return productImage;
  }

  async update(
    id: number,
    updateProductImageDto: UpdateProductImageDto,
  ): Promise<ProductImage> {
    const productImage = await this.findOne(id);
    Object.assign(productImage, updateProductImageDto);
    return await this.productImageRepository.save(productImage);
  }

  async remove(id: number): Promise<void> {
    const productImage = await this.findOne(id);
    await this.productImageRepository.remove(productImage);
  }
}

