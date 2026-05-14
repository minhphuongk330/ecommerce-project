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

  // Seed bộ lọc chuẩn cho danh mục Điện thoại (categoryId = 1)
  async seedPhoneAttributes(): Promise<string> {
    const PHONE_CATEGORY_ID = 1;

    // Xoá toàn bộ attribute_defs cũ của danh mục này trước khi seed lại
    const existing = await this.attributeDefRepository.find({
      where: { categoryId: PHONE_CATEGORY_ID },
    });
    if (existing.length > 0) {
      await this.attributeDefRepository.remove(existing);
    }

    // Định nghĩa bộ lọc — name là JSON key khớp với specifications, value là danh sách tùy chọn cách nhau bằng dấu phẩy
    const phoneAttributes = [
      { name: 'brand', value: 'Samsung,Apple,OPPO,Xiaomi,Vivo,Realme,Nokia,Motorola,HONOR,Sony' },
      { name: 'ram', value: '2 GB,3 GB,4 GB,6 GB,8 GB,12 GB,16 GB' },
      { name: 'storage', value: '32 GB,64 GB,128 GB,256 GB,512 GB,1 TB' },
      { name: 'os', value: 'Android 12,Android 13,Android 14,Android 15,iOS 16,iOS 17,iOS 18' },
      { name: 'battery', value: '3000 mAh,4000 mAh,5000 mAh,5500 mAh,6000 mAh,6500 mAh' },
      { name: 'screenSize', value: '5.0",5.5",6.0",6.1",6.5",6.6",6.7",6.8"' },
    ];

    const created = phoneAttributes.map((attr) =>
      this.attributeDefRepository.create({
        name: attr.name,
        categoryId: PHONE_CATEGORY_ID,
        value: attr.value,
      }),
    );

    await this.attributeDefRepository.save(created);
    return `✅ Đã seed ${created.length} bộ lọc cho danh mục Điện thoại (categoryId=${PHONE_CATEGORY_ID})`;
  }
}

