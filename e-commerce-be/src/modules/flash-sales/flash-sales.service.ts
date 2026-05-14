import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { FlashSaleItem } from '../../entities/flash-sale-item.entity';
import { FlashSale } from '../../entities/flash-sale.entity';

@Injectable()
export class FlashSalesService {
  constructor(
    @InjectRepository(FlashSale)
    private readonly flashSaleRepository: Repository<FlashSale>,
    @InjectRepository(FlashSaleItem)
    private readonly flashSaleItemRepository: Repository<FlashSaleItem>,
  ) { }

  async findActive(): Promise<FlashSale | null> {
    const now = new Date();
    return this.flashSaleRepository.findOne({
      where: { isActive: true, endsAt: MoreThan(now) },
      relations: ['items', 'items.product', 'items.product.category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<FlashSale[]> {
    return this.flashSaleRepository.find({
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<FlashSale> {
    const sale = await this.flashSaleRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'items.product.category'],
    });
    if (!sale) throw new NotFoundException(`Flash sale #${id} not found`);
    return sale;
  }

  async create(data: {
    title: string;
    endsAt: string;
    isActive?: boolean;
    items?: {
      productId: number;
      salePrice: number;
      originalPrice: number;
      quantity: number;
    }[];
  }): Promise<FlashSale> {
    const { items, ...saleData } = data;
    const sale = this.flashSaleRepository.create({
      ...saleData,
      endsAt: new Date(saleData.endsAt),
    });
    const saved = await this.flashSaleRepository.save(sale);

    if (items?.length) {
      const itemEntities = items.map((item) =>
        this.flashSaleItemRepository.create({ ...item, flashSaleId: saved.id }),
      );
      await this.flashSaleItemRepository.save(itemEntities);
    }
    return this.findOne(saved.id);
  }

  async update(
    id: number,
    data: Partial<{ title: string; endsAt: string; isActive: boolean }>,
  ): Promise<FlashSale> {
    const sale = await this.findOne(id);
    Object.assign(sale, {
      ...data,
      endsAt: data.endsAt ? new Date(data.endsAt) : sale.endsAt,
    });
    await this.flashSaleRepository.save(sale);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const sale = await this.findOne(id);
    await this.flashSaleRepository.remove(sale);
  }
}
