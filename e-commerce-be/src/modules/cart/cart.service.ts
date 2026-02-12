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
    const { productId, quantity, color, variantId } = createCartDto;

    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['variants'],
    });

    if (!product) {
      throw new NotFoundException('The product does not exist!');
    }

    let stockAvailable = product.stock;

    if (variantId) {
      const selectedVariant = product.variants.find((v) => v.id === variantId);
      if (!selectedVariant) {
        throw new BadRequestException('Selected variant does not exist');
      }
      stockAvailable = selectedVariant.stock;
    }

    if (quantity > stockAvailable) {
      throw new BadRequestException(
        `Only ${stockAvailable} items available for this version. Cannot add ${quantity}.`,
      );
    }

    const existing = await this.cartRepository.findOne({
      where: {
        customerId,
        productId,
        color: color ? color : IsNull(),
        variantId: variantId ? variantId : IsNull(),
      },
    });

    if (existing) {
      const totalQuantity = existing.quantity + quantity;
      if (totalQuantity > stockAvailable) {
        throw new BadRequestException(
          `Cart already has ${existing.quantity}. Stock available: ${stockAvailable}. Cannot add more.`,
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
      variantId,
    });

    return await this.cartRepository.save(newItem);
  }

  async findAll(customerId: number) {
    return await this.cartRepository.find({
      where: { customerId },

      relations: ['product', 'product.variants'],
      order: { id: 'DESC' },
    });
  }

  async updateQuantity(customerId: number, id: number, quantity: number) {
    const item = await this.cartRepository.findOne({
      where: { id, customerId },
      relations: ['product', 'product.variants'],
    });

    if (!item) {
      throw new NotFoundException('Product not found in cart.');
    }

    let stockAvailable = item.product.stock;
    if (item.variantId) {
      const variant = item.product.variants.find(
        (v) => v.id === item.variantId,
      );
      if (variant) stockAvailable = variant.stock;
    }

    if (quantity > stockAvailable) {
      throw new BadRequestException(
        `Only ${stockAvailable} items available. Cannot update to ${quantity}.`,
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
