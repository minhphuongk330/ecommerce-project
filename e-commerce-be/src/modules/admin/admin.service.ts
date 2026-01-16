import { UpdateProductDto } from './../products/dto/update-product.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { Product } from '../../entities/product.entity';
import { Customer, Role } from '../../entities/customer.entity';
import { Category } from '../../entities/category.entity';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getDashboardStats() {
    const revenueResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.status = :status', { status: 'Completed' })
      .getRawOne();

    const totalRevenue =
      revenueResult && revenueResult.total
        ? parseFloat(revenueResult.total)
        : 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await this.orderRepository.count({
      where: { createdAt: MoreThanOrEqual(today) },
    });

    const totalOrders = await this.orderRepository.count();
    const totalCustomers = await this.customerRepository.count({
      where: { role: Role.CUSTOMER },
    });
    const lowStockProducts = await this.productRepository.count({
      where: { stock: LessThanOrEqual(10) },
    });

    return {
      totalRevenue,
      todayOrders,
      totalOrders,
      totalCustomers,
      lowStockProducts,
    };
  }

  async getCustomers() {
    return this.customerRepository.find({
      where: { role: Role.CUSTOMER },
      relations: ['profile'],
      select: {
        id: true,
        email: true,
        fullName: true,
        isActive: true,
        createdAt: true,
        role: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getProducts() {
    return this.productRepository.find({
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async getCategories() {
    return this.categoryRepository.find({
      order: { name: 'ASC' },
    });
  }

  async createProduct(dto: CreateProductDto) {
    const { colors, ...productData } = dto;

    const product = this.productRepository.create({
      ...productData,
      category: dto.categoryId ? { id: dto.categoryId } : undefined,
      productColors:
        colors?.map((c) => ({
          colorName: c.colorName,
          colorHex: c.colorHex,
        })) || [],
    });

    return this.productRepository.save(product);
  }

  async updateProduct(id: number, dto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');

    const updatedProduct = this.productRepository.merge(product, {
      ...dto,
      category: dto.categoryId ? { id: dto.categoryId } : undefined,
    });

    return this.productRepository.save(updatedProduct);
  }

  async deleteProduct(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');

    return this.productRepository.remove(product);
  }

  async getOrders() {
    return this.orderRepository.find({
      relations: ['customer', 'orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderDetail(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'address', 'orderItems', 'orderItems.product'],
    });
    if (!order) throw new NotFoundException('Đơn hàng không tồn tại');
    return order;
  }

  async updateOrderStatus(id: number, dto: UpdateOrderStatusDto) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Đơn hàng không tồn tại');

    order.status = dto.status;
    return this.orderRepository.save(order);
  }
}
