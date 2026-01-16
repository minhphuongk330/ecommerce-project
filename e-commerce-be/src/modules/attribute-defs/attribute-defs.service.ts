import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttributeDef } from '../../entities/attribute-def.entity';
import { CreateAttributeDefDto } from './dto/create-attribute-def.dto';
import { UpdateAttributeDefDto } from './dto/update-attribute-def.dto';

@Injectable()
export class AttributeDefsService {
  constructor(
    @InjectRepository(AttributeDef)
    private readonly attributeDefRepository: Repository<AttributeDef>,
  ) {}

  async create(
    createAttributeDefDto: CreateAttributeDefDto,
  ): Promise<AttributeDef> {
    const attributeDef =
      this.attributeDefRepository.create(createAttributeDefDto);
    return await this.attributeDefRepository.save(attributeDef);
  }

  async findAll(): Promise<AttributeDef[]> {
    return await this.attributeDefRepository.find({
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<AttributeDef> {
    const attributeDef = await this.attributeDefRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!attributeDef) {
      throw new NotFoundException(`AttributeDef with ID ${id} not found`);
    }
    return attributeDef;
  }

  async update(
    id: number,
    updateAttributeDefDto: UpdateAttributeDefDto,
  ): Promise<AttributeDef> {
    const attributeDef = await this.findOne(id);
    Object.assign(attributeDef, updateAttributeDefDto);
    return await this.attributeDefRepository.save(attributeDef);
  }

  async remove(id: number): Promise<void> {
    const attributeDef = await this.findOne(id);
    await this.attributeDefRepository.remove(attributeDef);
  }
}

