import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductColor } from '../../entities/product-color.entity';
import { CreateProductColorDto } from './dto/create-product-color.dto';
import { UpdateProductColorDto } from './dto/update-product-color.dto';

@Injectable()
export class ProductColorsService {
  constructor(
    @InjectRepository(ProductColor)
    private readonly productColorRepository: Repository<ProductColor>,
  ) {}

  async create(
    createProductColorDto: CreateProductColorDto,
  ): Promise<ProductColor> {
    const productColor =
      this.productColorRepository.create(createProductColorDto);
    return await this.productColorRepository.save(productColor);
  }

  async findAll(): Promise<ProductColor[]> {
    return await this.productColorRepository.find({
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ProductColor> {
    const productColor = await this.productColorRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!productColor) {
      throw new NotFoundException(`ProductColor with ID ${id} not found`);
    }
    return productColor;
  }

  async update(
    id: number,
    updateProductColorDto: UpdateProductColorDto,
  ): Promise<ProductColor> {
    const productColor = await this.findOne(id);
    Object.assign(productColor, updateProductColorDto);
    return await this.productColorRepository.save(productColor);
  }

  async remove(id: number): Promise<void> {
    const productColor = await this.findOne(id);
    await this.productColorRepository.remove(productColor);
  }
}

