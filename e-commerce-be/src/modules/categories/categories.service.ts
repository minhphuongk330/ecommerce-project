import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const trimmedName = createCategoryDto.name?.trim();
    const existing = await this.categoryRepository.findOne({
      where: { name: trimmedName },
    });
    if (existing) {
      throw new ConflictException('Tên danh mục đã tồn tại');
    }
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      name: trimmedName,
    });
    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Không tìm thấy Danh mục với ID ${id}`);
    }
    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);
    if (updateCategoryDto.name) {
      const trimmedName = updateCategoryDto.name.trim();
      if (trimmedName !== category.name) {
        const existing = await this.categoryRepository.findOne({
          where: { name: trimmedName },
        });
        if (existing) {
          throw new ConflictException('Tên danh mục đã tồn tại');
        }
      }
      updateCategoryDto.name = trimmedName;
    }
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}

