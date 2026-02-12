import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { ProductVariant } from '../../entities/product-variant.entity';
import { Product } from '../../entities/product.entity';
import { MailService } from '../mail/mail.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,

    private readonly mailService: MailService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    return await this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: [
        'customer',
        'address',
        'orderItems',
        'orderItems.product',
        'orderItems.product.variants',
      ],
      order: { createdAt: 'DESC' },
      withDeleted: true,
    });
  }

  async findByCustomerId(customerId: number): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { customerId },
      relations: [
        'customer',
        'address',
        'orderItems',
        'orderItems.product',
        'orderItems.product.variants',
      ],
      order: { createdAt: 'DESC' },
      withDeleted: true,
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: [
        'customer',
        'address',
        'orderItems',
        'orderItems.product',
        'orderItems.product.variants',
      ],
      withDeleted: true,
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    const previousStatus = order.status;
    Object.assign(order, updateOrderDto);

    if (
      updateOrderDto.status === 'Cancelled' &&
      previousStatus !== 'Cancelled'
    ) {
      if (order.orderItems && order.orderItems.length > 0) {
        for (const orderItem of order.orderItems) {
          if (orderItem.variantId) {
            const variant = await this.variantRepository.findOne({
              where: { id: orderItem.variantId },
            });
            if (variant) {
              variant.stock += orderItem.quantity;
              await this.variantRepository.save(variant);
            }
          }

          const product = await this.productRepository.findOne({
            where: { id: orderItem.productId },
          });

          if (product) {
            product.stock += orderItem.quantity;
            await this.productRepository.save(product);
          }
        }
      }
    }

    return await this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }

  async sendEmailConfirmation(id: number): Promise<void> {
    const order = await this.findOne(id);
    if (order) {
      await this.mailService.sendOrderConfirmation(order);
    }
  }
}
