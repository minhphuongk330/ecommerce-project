import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ProductVariant } from '../../entities/product-variant.entity';
import { Product } from '../../entities/product.entity';

@EventSubscriber()
@Injectable()
export class ProductVariantSubscriber
  implements EntitySubscriberInterface<ProductVariant>
{
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return ProductVariant;
  }

  async afterInsert(event: InsertEvent<ProductVariant>) {
    await this.syncProductStock(event.manager, event.entity.productId);
  }

  async afterUpdate(event: UpdateEvent<ProductVariant>) {
    const variantId = event.entity?.id || event.databaseEntity?.id;
    const variant = await event.manager.findOne(ProductVariant, {
      where: { id: variantId },
      select: ['productId'],
    });

    if (variant && variant.productId) {
      await this.syncProductStock(event.manager, variant.productId);
    }
  }

  async afterRemove(event: RemoveEvent<ProductVariant>) {
    const productId =
      event.entity?.productId || event.databaseEntity?.productId;
    if (productId) {
      await this.syncProductStock(event.manager, productId);
    }
  }

  private async syncProductStock(manager: any, productId: number) {
    if (!productId) return;

    const { total } = await manager
      .createQueryBuilder(ProductVariant, 'variant')
      .select('SUM(variant.stock)', 'total')
      .where('variant.product_id = :id', { id: productId })
      .getRawOne();

    const newStock = Number(total) || 0;

    await manager.update(Product, productId, {
      stock: newStock,
    });

    console.log(
      `✅ Đã đồng bộ kho cho Product ID ${productId}: Tổng mới = ${newStock}`,
    );
  }
}
