import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import { CartItem } from '../../entities/cart-item.entity';
import { Product } from '../../entities/product.entity';
import { FlashSaleItem } from '../../entities/flash-sale-item.entity';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepository: Repository<CartItem>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) { }

  private async getRemainingFlashSale(productId: number): Promise<number | null> {
    const now = new Date();
    const flashSaleItem = await this.dataSource.manager
      .createQueryBuilder(FlashSaleItem, 'fsi')
      .innerJoin('fsi.flashSale', 'fs')
      .where('fsi.productId = :productId', { productId })
      .andWhere('fs.isActive = true')
      .andWhere('fs.endsAt > :now', { now })
      .select(['fsi.id', 'fsi.quantity', 'fsi.soldQuantity'])
      .getOne();

    if (!flashSaleItem) return null;
    return Math.max(0, flashSaleItem.quantity - flashSaleItem.soldQuantity);
  }

  async create(customerId: number, createCartDto: CreateCartDto) {
    const { productId, quantity, color } = createCartDto;

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại!');
    }

    const remainingFlashSale = await this.getRemainingFlashSale(productId);
    const stockAvailable = remainingFlashSale !== null
      ? Math.min(product.stock, remainingFlashSale)
      : product.stock;

    if (quantity > stockAvailable) {
      const message = remainingFlashSale !== null
        ? `Sản phẩm Flash Sale này chỉ còn ${remainingFlashSale} suất giảm giá. Bạn đang chọn ${quantity}.`
        : `Only ${stockAvailable} items available. Cannot add ${quantity}.`;
      throw new BadRequestException(message);
    }

    const existing = await this.cartRepository.findOne({
      where: {
        customerId,
        productId,
        color: color ? color : IsNull(),
      },
    });

    if (existing) {
      const totalQuantity = existing.quantity + quantity;
      if (totalQuantity > stockAvailable) {
        const message = remainingFlashSale !== null
          ? `Giỏ hàng đã có ${existing.quantity} sản phẩm. Suất Flash Sale còn lại: ${remainingFlashSale}.`
          : `Cart already has ${existing.quantity}. Stock available: ${stockAvailable}. Cannot add more.`;
        throw new BadRequestException(message);
      }

      existing.quantity += quantity;
      return await this.cartRepository.save(existing);
    }

    const newItem = this.cartRepository.create({
      customerId,
      productId,
      quantity,
      color,
    });

    return await this.cartRepository.save(newItem);
  }

  async findAll(customerId: number) {
    return await this.cartRepository.find({
      where: { customerId },
      relations: ['product'],
      order: { id: 'DESC' },
    });
  }

  async updateQuantity(customerId: number, id: number, quantity: number) {
    const item = await this.cartRepository.findOne({
      where: { id, customerId },
      relations: ['product'],
    });

    if (!item) {
      throw new NotFoundException('Sản phẩm không có trong giỏ hàng.');
    }

    const remainingFlashSale = await this.getRemainingFlashSale(item.productId);
    const stockAvailable = remainingFlashSale !== null
      ? Math.min(item.product.stock, remainingFlashSale)
      : item.product.stock;

    if (quantity > stockAvailable) {
      const message = remainingFlashSale !== null
        ? `Sản phẩm Flash Sale này chỉ còn ${remainingFlashSale} suất giảm giá.`
        : `Only ${stockAvailable} items available. Cannot update to ${quantity}.`;
      throw new BadRequestException(message);
    }

    item.quantity = quantity;
    return await this.cartRepository.save(item);
  }

  async remove(customerId: number, id: number) {
    const item = await this.cartRepository.findOne({
      where: { id, customerId },
    });

    if (item) {
      return await this.cartRepository.remove(item);
    }
    return;
  }

  async clearCart(customerId: number) {
    return await this.cartRepository.delete({ customerId });
  }
}
