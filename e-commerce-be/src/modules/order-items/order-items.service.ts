import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../../entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const orderItem = this.orderItemRepository.create(createOrderItemDto);
    return await this.orderItemRepository.save(orderItem);
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
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
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

