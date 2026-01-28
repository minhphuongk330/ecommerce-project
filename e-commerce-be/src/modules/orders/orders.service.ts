import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly mailService: MailService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    return await this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['customer', 'address', 'orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' },
      withDeleted: true,
    });
  }

  async findByCustomerId(customerId: number): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { customerId },
      relations: ['customer', 'address', 'orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' },
      withDeleted: true,
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'address', 'orderItems', 'orderItems.product'],
      withDeleted: true,
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
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
