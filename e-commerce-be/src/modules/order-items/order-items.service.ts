import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FlashSaleItem } from '../../entities/flash-sale-item.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { Product } from '../../entities/product.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(FlashSaleItem)
    private readonly flashSaleItemRepository: Repository<FlashSaleItem>,
    private readonly dataSource: DataSource,
    private readonly notificationsService: NotificationsService,
  ) { }

  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const quantity = createOrderItemDto.quantity || 1;

    const product = await this.productRepository.findOne({
      where: { id: createOrderItemDto.productId },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${createOrderItemDto.productId} not found`,
      );
    }

    if (!createOrderItemDto.skipStockDecrement) {
      if (product.specifications && product.specifications.colorStock && createOrderItemDto.colorId) {
        const colorStock = product.specifications.colorStock;
        const colorId = createOrderItemDto.colorId;
        const colorQty = Number(colorStock[colorId]);

        if (isNaN(colorQty) || colorQty < quantity) {
          throw new BadRequestException(
            `Số lượng tồn kho của màu "${colorId}" thuộc sản phẩm "${product.name}" không đủ. Còn lại: ${isNaN(colorQty) ? 0 : colorQty}, Yêu cầu: ${quantity}`,
          );
        }
        colorStock[colorId] = colorQty - quantity;
        product.specifications = {
          ...product.specifications,
          colorStock,
        };
      }

      if (product.stock < quantity) {
        throw new BadRequestException(
          `Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${quantity}`,
        );
      }
      product.stock -= quantity;
      await this.productRepository.save(product);

      if (product.stock <= 0) {
        try {
          await this.notificationsService.createNotification(
            null,
            'Sản phẩm hết hàng',
            `Sản phẩm "${product.name}" đã hết hàng trong kho.`,
            'OUT_OF_STOCK',
            '/admin/products',
            true,
          );
        } catch (error) {
          console.error('Failed to create out of stock notification:', error);
        }
      }

      // Cập nhật soldQuantity cho Flash Sale nếu sản phẩm đang trong flash sale active
      await this.updateFlashSaleSoldQuantity(createOrderItemDto.productId, quantity);
    }

    const orderItem = this.orderItemRepository.create(createOrderItemDto);
    return await this.orderItemRepository.save(orderItem);
  }


  /**
   * Cập nhật soldQuantity bằng atomic raw query để tránh race condition.
   * Ném BadRequestException nếu vượt quá số lượng flash sale cho phép.
   */
  private async updateFlashSaleSoldQuantity(productId: number, quantity: number): Promise<void> {
    const now = new Date();

    // Tìm flash sale item active cho sản phẩm này
    const flashSaleItem = await this.flashSaleItemRepository
      .createQueryBuilder('fsi')
      .innerJoin('fsi.flashSale', 'fs')
      .where('fsi.productId = :productId', { productId })
      .andWhere('fs.isActive = true')
      .andWhere('fs.endsAt > :now', { now })
      .select(['fsi.id', 'fsi.quantity', 'fsi.soldQuantity'])
      .getOne();

    if (!flashSaleItem) return; // Sản phẩm không trong flash sale → bỏ qua

    // Kiểm tra oversell: không cho mua vượt quá suất flash sale còn lại
    const remaining = flashSaleItem.quantity - flashSaleItem.soldQuantity;
    if (quantity > remaining) {
      throw new BadRequestException(
        `Flash Sale cho sản phẩm này chỉ còn ${remaining} suất. Bạn đang mua ${quantity}.`,
      );
    }

    // Atomic increment bằng raw UPDATE — tránh race condition khi nhiều request đồng thời
    // Double-check ở mức DB: chỉ update nếu vẫn còn đủ chỗ
    await this.dataSource
      .createQueryBuilder()
      .update(FlashSaleItem)
      .set({ soldQuantity: () => `sold_quantity + ${quantity}` })
      .where('id = :id', { id: flashSaleItem.id })
      .andWhere('sold_quantity + :quantity <= quantity', { quantity })
      .execute();
  }

  async findAll(): Promise<OrderItem[]> {
    return await this.orderItemRepository.find({
      relations: ['order', 'product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id },
      relations: ['order', 'product'],
    });
    if (!orderItem) {
      throw new NotFoundException(`Không tìm thấy OrderItem với ID ${id}`);
    }
    return orderItem;
  }

  async update(
    id: number,
    updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    const orderItem = await this.findOne(id);
    Object.assign(orderItem, updateOrderItemDto);
    return await this.orderItemRepository.save(orderItem);
  }

  async remove(id: number): Promise<void> {
    const orderItem = await this.findOne(id);
    await this.orderItemRepository.remove(orderItem);
  }
}
