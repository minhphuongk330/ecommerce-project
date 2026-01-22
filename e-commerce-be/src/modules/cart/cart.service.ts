import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CartItem } from '../../entities/cart-item.entity';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepository: Repository<CartItem>,
  ) {}

  async create(customerId: number, createCartDto: CreateCartDto) {
    const { productId, quantity, color } = createCartDto;

    const existing = await this.cartRepository.findOne({
      where: {
        customerId,
        productId,
        color: color ? color : IsNull(),
      },
    });

    if (existing) {
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
    });
    if (item) {
      item.quantity = quantity;
      return await this.cartRepository.save(item);
    }
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
