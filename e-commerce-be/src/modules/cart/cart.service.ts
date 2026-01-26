import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CartItem } from '../../entities/cart-item.entity';
import { Product } from '../../entities/product.entity';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepository: Repository<CartItem>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(customerId: number, createCartDto: CreateCartDto) {
    const { productId, quantity, color } = createCartDto;

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('The product does not exist!');
    }

    if (quantity > product.stock) {
      throw new BadRequestException(
        `Only ${product.stock} items available in stock. Cannot add ${quantity}.`,
      );
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
      if (totalQuantity > product.stock) {
        throw new BadRequestException(
          `Your cart already has ${existing.quantity} items. Stock available: ${product.stock}. Cannot add ${quantity} more.`,
        );
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
      throw new NotFoundException('Product not found in cart.');
    }

    if (quantity > item.product.stock) {
      throw new BadRequestException(
        `Only ${item.product.stock} items available in stock. Cannot update quantity to ${quantity}.`,
      );
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
