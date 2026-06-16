import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { FlashSaleItem } from '../../entities/flash-sale-item.entity';
import { FlashSale } from '../../entities/flash-sale.entity';

@Injectable()
export class FlashSalesService {
  constructor(
    @InjectRepository(FlashSale)
    private readonly flashSaleRepository: Repository<FlashSale>,
    @InjectRepository(FlashSaleItem)
    private readonly flashSaleItemRepository: Repository<FlashSaleItem>,
    private readonly dataSource: DataSource,
  ) { }

  async findActive(): Promise<FlashSale | null> {
    const now = new Date();
    const activeSales = await this.flashSaleRepository.find({
      where: { isActive: true, endsAt: MoreThan(now) },
      relations: ['items', 'items.product', 'items.product.category'],
      order: { endsAt: 'ASC' }, // Sắp xếp theo hạn kết thúc gần nhất
    });

    if (activeSales.length === 0) return null;
    if (activeSales.length === 1) return activeSales[0];

    // Gộp nhiều chiến dịch active: dùng title và endsAt của chiến dịch kết thúc sớm nhất
    const mergedSale = {
      ...activeSales[0],
      items: activeSales.reduce((acc, sale) => {
        return acc.concat(sale.items || []);
      }, [] as FlashSaleItem[]),
    };

    return mergedSale as any;
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
    if (!sale) throw new NotFoundException(`Không tìm thấy Flash sale #${id}`);
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
    data: Partial<{
      title: string;
      endsAt: string;
      isActive: boolean;
      items?: {
        id?: number;
        productId: number;
        salePrice: number;
        originalPrice: number;
        quantity: number;
      }[];
    }>,
  ): Promise<FlashSale> {
    const sale = await this.findOne(id);
    const { items, ...saleData } = data;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (saleData.title !== undefined) sale.title = saleData.title;
      if (saleData.endsAt !== undefined) sale.endsAt = new Date(saleData.endsAt);
      if (saleData.isActive !== undefined) sale.isActive = saleData.isActive;
      await queryRunner.manager.save(sale);

      if (items !== undefined) {
        const oldItems = sale.items || [];
        const incomingIds = items
          .map((item) => item.id)
          .filter((itemId): itemId is number => itemId !== undefined);

        // Delete items not in incoming list
        const itemsToDelete = oldItems.filter((item) => !incomingIds.includes(item.id));
        if (itemsToDelete.length > 0) {
          await queryRunner.manager.remove(itemsToDelete);
        }

        // Update or insert items
        for (const item of items) {
          if (item.id) {
            const existing = oldItems.find((oi) => oi.id === item.id);
            if (existing) {
              existing.productId = item.productId;
              existing.salePrice = item.salePrice;
              existing.originalPrice = item.originalPrice;
              existing.quantity = item.quantity;
              await queryRunner.manager.save(existing);
            }
          } else {
            const newItem = this.flashSaleItemRepository.create({
              ...item,
              flashSaleId: sale.id,
            });
            await queryRunner.manager.save(newItem);
          }
        }
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const sale = await this.findOne(id);
    await this.flashSaleRepository.remove(sale);
  }
}
