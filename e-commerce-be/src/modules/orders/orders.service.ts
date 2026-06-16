import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlashSaleItem } from '../../entities/flash-sale-item.entity';
import { Order } from '../../entities/order.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { Product } from '../../entities/product.entity';
import { Coupon } from '../../entities/coupon.entity';
import { CustomerCoupon } from '../../entities/customer-coupon.entity';
import { MailService } from '../mail/mail.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(FlashSaleItem)
    private readonly flashSaleItemRepository: Repository<FlashSaleItem>,

    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,

    @InjectRepository(CustomerCoupon)
    private readonly customerCouponRepository: Repository<CustomerCoupon>,

    private readonly mailService: MailService,
    private readonly notificationsService: NotificationsService,
  ) { }


  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Validate coupon và shipping coupon của customer trước khi tạo đơn
    const couponCodesToValidate = [createOrderDto.appliedCouponCode, createOrderDto.appliedShippingCouponCode].filter(
      (code): code is string => Boolean(code),
    );
    if (couponCodesToValidate.length > 0 && createOrderDto.customerId) {
      for (const code of couponCodesToValidate) {
        if (!code) continue;
        const coupon = await this.couponRepository.findOne({ where: { code: code.toUpperCase() } });
        if (!coupon) throw new BadRequestException(`Mã giảm giá ${code} không tồn tại`);
        if (!coupon.isActive) throw new BadRequestException(`Mã giảm giá ${code} không hoạt động`);

        const customerCoupon = await this.customerCouponRepository.findOne({
          where: { customerId: createOrderDto.customerId, couponId: coupon.id },
        });
        if (customerCoupon) {
          const limit = coupon.usageLimitPerUser ?? 1;
          if (customerCoupon.usedCount >= limit) {
            throw new BadRequestException(`Bạn đã sử dụng hết lượt của mã giảm giá ${code}`);
          }
        }
      }
    }

    const order = this.orderRepository.create(createOrderDto);
    const savedOrder = await this.orderRepository.save(order);

    try {
      await this.notificationsService.createNotification(
        null,
        'Đơn hàng mới',
        `Đơn hàng mới #${savedOrder.orderNo} vừa được đặt thành công.`,
        'NEW_ORDER',
        `/admin/orders`,
        true,
      );
    } catch (error) {
      console.error('Failed to create new order notification:', error);
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
          let customerCoupon = await this.customerCouponRepository.findOne({
            where: { customerId: createOrderDto.customerId, couponId: coupon.id },
          });
          if (!customerCoupon) {
            customerCoupon = this.customerCouponRepository.create({
              customerId: createOrderDto.customerId,
              couponId: coupon.id,
              usedCount: 1,
            });
            await this.customerCouponRepository.save(customerCoupon);
          } else {
            await this.customerCouponRepository.increment({ id: customerCoupon.id }, 'usedCount', 1);
          }
        }
      }
    }

    try {
      // Chỉ gửi email xác nhận ngay cho COD.
      // VNPAY sẽ gửi email sau khi xác nhận thanh toán thành công qua callback.
      if (createOrderDto.paymentMethod !== 'VNPAY') {
        await this.mailService.sendOrderConfirmation(savedOrder);
      }
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }

    return savedOrder;
  }

  async createFullOrderFromPayload(payload: any, txnRef: string): Promise<Order> {
    // 1. Check if order with txnRef already exists to prevent duplicate execution
    const existingOrder = await this.orderRepository.findOne({
      where: { txnRef },
      relations: ['customer', 'address', 'orderItems', 'orderItems.product'],
    });
    if (existingOrder) {
      return existingOrder;
    }

    // 2. Generate unique order number if not provided
    const orderNo = payload.orderNo || `ORD-${Date.now()}`;

    // 3. Create the order
    const order = this.orderRepository.create({
      orderNo: orderNo,
      customerId: payload.userId,
      addressId: payload.addressId,
      status: 'Processing', // Already verified paid
      totalAmount: payload.totalAmount,
      subtotal: payload.subtotal,
      taxAmount: payload.taxAmount,
      shippingCost: payload.shippingCost,
      scheduledDeliveryDate: payload.scheduledDeliveryDate ? new Date(payload.scheduledDeliveryDate) : undefined,
      note: payload.note || 'Ordered via website (VNPAY)',
      paymentMethod: 'VNPAY',
      paymentStatus: 'paid',
      txnRef: txnRef,
      discount: payload.discount || 0,
      shippingDiscount: payload.shippingDiscount || 0,
    });

    // Validate coupon and shipping coupon
    const couponCodesToValidate = [payload.appliedCouponCode, payload.appliedShippingCouponCode].filter(
      (code): code is string => Boolean(code),
    );
    if (couponCodesToValidate.length > 0 && payload.userId) {
      for (const code of couponCodesToValidate) {
        if (!code) continue;
        const coupon = await this.couponRepository.findOne({ where: { code: code.toUpperCase() } });
        if (!coupon) throw new BadRequestException(`Mã giảm giá ${code} không tồn tại`);
        if (!coupon.isActive) throw new BadRequestException(`Mã giảm giá ${code} không hoạt động`);

        const customerCoupon = await this.customerCouponRepository.findOne({
          where: { customerId: payload.userId, couponId: coupon.id },
        });
        if (customerCoupon) {
          const limit = coupon.usageLimitPerUser ?? 1;
          if (customerCoupon.usedCount >= limit) {
            throw new BadRequestException(`Bạn đã sử dụng hết lượt của mã giảm giá ${code}`);
          }
        }
      }
    }

    const savedOrder = await this.orderRepository.save(order);

    try {
      await this.notificationsService.createNotification(
        null,
        'Đơn hàng mới',
        `Đơn hàng mới #${savedOrder.orderNo} vừa được đặt thành công (Thanh toán VNPAY).`,
        'NEW_ORDER',
        `/admin/orders`,
        true,
      );
    } catch (error) {
      console.error('Failed to create VNPAY new order notification:', error);
    }

    // 4. Update coupon usage
    const couponCodes = [payload.appliedCouponCode, payload.appliedShippingCouponCode].filter(
      (code): code is string => Boolean(code),
    );
    if (couponCodes.length > 0 && payload.userId) {
      for (const code of couponCodes) {
        if (!code) continue;
        const coupon = await this.couponRepository.findOne({ where: { code: code.toUpperCase() } });
        if (coupon) {
          // Increase global usage
          await this.couponRepository.increment({ id: coupon.id }, 'usedCount', 1);
          // Increase customer usage
          let customerCoupon = await this.customerCouponRepository.findOne({
            where: { customerId: payload.userId, couponId: coupon.id },
          });
          if (!customerCoupon) {
            customerCoupon = this.customerCouponRepository.create({
              customerId: payload.userId,
              couponId: coupon.id,
              usedCount: 1,
            });
            await this.customerCouponRepository.save(customerCoupon);
          } else {
            await this.customerCouponRepository.increment({ id: customerCoupon.id }, 'usedCount', 1);
          }
        }
      }
    }

    // 5. Create OrderItems & decrement stock/update flash sales
    if (payload.items && payload.items.length > 0) {
      for (const item of payload.items) {
        const productId = Number(item.id);
        const quantity = item.quantity || 1;

        const product = await this.productRepository.findOne({
          where: { id: productId },
        });

        if (!product) {
          throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        // Validate stock
        if (product.stock < quantity) {
          throw new BadRequestException(
            `Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${quantity}`,
          );
        }

        // Validate and decrement color-specific stock
        const colorId = item.selectedColor;
        if (product.specifications && product.specifications.colorStock && colorId) {
          const colorStock = product.specifications.colorStock;
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

        // Decrement stock
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

        // Update flash sale sold quantity if applicable
        await this.updateFlashSaleSoldQuantity([{ productId, quantity }], 'increase');

        // Create OrderItem
        const orderItem = this.orderItemRepository.create({
          orderId: savedOrder.id,
          productId: productId,
          colorId: item.selectedColor || undefined,
          unitPrice: Number(item.price),
          quantity: quantity,
        });
        await this.orderItemRepository.save(orderItem);
      }
    }

    // 6. Send confirmation email
    try {
      const fullOrder = await this.orderRepository.findOne({
        where: { id: savedOrder.id },
        relations: ['customer', 'address', 'orderItems', 'orderItems.product'],
      });
      if (fullOrder) {
        await this.mailService.sendOrderConfirmation(fullOrder);
      }
    } catch (error) {
      console.error('Failed to send VNPAY confirmation email:', error);
    }

    // Return the full order
    const finalOrder = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['customer', 'address', 'orderItems', 'orderItems.product'],
    });

    if (!finalOrder) {
      throw new NotFoundException(`Failed to retrieve order after creation`);
    }

    return finalOrder;
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
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID ${id}`);
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
            // Restore color stock if applicable
            if (product.specifications && product.specifications.colorStock && orderItem.colorId) {
              const colorStock = product.specifications.colorStock;
              const colorId = orderItem.colorId;
              const colorQty = Number(colorStock[colorId]) || 0;
              colorStock[colorId] = colorQty + orderItem.quantity;
              product.specifications = {
                ...product.specifications,
                colorStock,
              };
            }

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
