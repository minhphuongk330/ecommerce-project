import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlashSaleItem } from '../../entities/flash-sale-item.entity';
import { Order } from '../../entities/order.entity';
import { Product } from '../../entities/product.entity';
import { Coupon } from '../../entities/coupon.entity';
import { CustomerCoupon } from '../../entities/customer-coupon.entity';
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

    @InjectRepository(FlashSaleItem)
    private readonly flashSaleItemRepository: Repository<FlashSaleItem>,

    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,

    @InjectRepository(CustomerCoupon)
    private readonly customerCouponRepository: Repository<CustomerCoupon>,

    private readonly mailService: MailService,
  ) { }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    const savedOrder = await this.orderRepository.save(order);

    // Cập nhật soldQuantity cho flash sale items
    if (savedOrder.orderItems && savedOrder.orderItems.length > 0) {
      await this.updateFlashSaleSoldQuantity(savedOrder.orderItems, 'increase');
    }

    // Tăng lượt dùng coupon
    const couponCodes = [createOrderDto.appliedCouponCode, createOrderDto.appliedShippingCouponCode].filter(
      (code): code is string => Boolean(code),
    );
    if (couponCodes.length > 0 && createOrderDto.customerId) {
      for (const code of couponCodes) {
        if (!code) continue;
        const coupon = await this.couponRepository.findOne({ where: { code: code.toUpperCase() } });
        if (coupon) {
          // Tăng lượt dùng toàn cục
          await this.couponRepository.increment({ id: coupon.id }, 'usedCount', 1);
          // Tăng lượt dùng cho customer
          const customerCoupon = await this.customerCouponRepository.findOne({
            where: { customerId: createOrderDto.customerId, couponId: coupon.id },
          });
          if (customerCoupon) {
            await this.customerCouponRepository.increment({ id: customerCoupon.id }, 'usedCount', 1);
          }
        }
      }
    }

    try {
      await this.mailService.sendOrderConfirmation(savedOrder);
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }

    return savedOrder;
  }

  private async updateFlashSaleSoldQuantity(orderItems: any[], action: 'increase' | 'decrease'): Promise<void> {
    for (const orderItem of orderItems) {
      // Tìm flash sale item đang active cho sản phẩm này
      const flashSaleItem = await this.flashSaleItemRepository.findOne({
        where: {
          productId: orderItem.productId,
        },
        relations: ['flashSale'],
      });

      if (flashSaleItem && flashSaleItem.flashSale && flashSaleItem.flashSale.isActive) {
        // Kiểm tra xem flash sale còn hiệu lực không
        const now = new Date();
        if (new Date(flashSaleItem.flashSale.endsAt) > now) {
          if (action === 'increase') {
            // Tăng soldQuantity khi đặt hàng
            flashSaleItem.soldQuantity += orderItem.quantity;
          } else {
            // Giảm soldQuantity khi hủy hàng
            flashSaleItem.soldQuantity = Math.max(0, flashSaleItem.soldQuantity - orderItem.quantity);
          }

          // Đảm bảo soldQuantity không vượt quá quantity
          flashSaleItem.soldQuantity = Math.min(flashSaleItem.soldQuantity, flashSaleItem.quantity);

          await this.flashSaleItemRepository.save(flashSaleItem);
        }
      }
    }
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: [
        'customer',
        'address',
        'orderItems',
        'orderItems.product',
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
        // Giảm soldQuantity cho flash sale items khi hủy order
        await this.updateFlashSaleSoldQuantity(order.orderItems, 'decrease');

        for (const orderItem of order.orderItems) {
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
