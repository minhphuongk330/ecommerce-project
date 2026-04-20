import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { Customer, Role } from '../../entities/customer.entity';
import { Order } from '../../entities/order.entity';
import { Product } from '../../entities/product.entity';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from './../products/dto/update-product.dto';
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
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 1);

    const monthRevenueResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.status = :status', { status: 'Completed' })
      .andWhere('order.createdAt >= :startDate', { startDate: monthStart })
      .andWhere('order.createdAt < :endDate', { endDate: monthEnd })
      .getRawOne();

    const monthRevenue =
      monthRevenueResult && monthRevenueResult.total
        ? parseFloat(monthRevenueResult.total)
        : 0;
    const totalRevenueResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.status = :status', { status: 'Completed' })
      .getRawOne();

    const totalRevenue =
      totalRevenueResult && totalRevenueResult.total
        ? parseFloat(totalRevenueResult.total)
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
      monthRevenue,
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
        isBanned: true,
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

  async getLowStockProducts(threshold: number) {
    return this.productRepository.find({
      where: { stock: LessThan(threshold), isActive: true },
      order: { stock: 'ASC' },
      take: 10,
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

  async getRevenueByPeriod(period: 'weekly' | 'monthly' | 'yearly') {
    const allOrders = await this.orderRepository.find();

    let startDate: Date;
    let prevStartDate: Date;
    const now = new Date();
    const endDate = new Date();

    if (period === 'yearly') {
      startDate = new Date(now.getFullYear(), 0, 1);
      prevStartDate = new Date(now.getFullYear() - 1, 0, 1);
    } else if (period === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    } else {
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startDate = new Date(now.getFullYear(), now.getMonth(), diff);
      startDate.setHours(0, 0, 0, 0);

      prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - 7);
    }

    let currentRevenue = 0;
    let currentOrders = 0;
    let prevRevenue = 0;
    let prevOrders = 0;

    allOrders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const amount = parseFloat(String(order.totalAmount || 0));

      if (orderDate >= startDate && orderDate <= endDate) {
        currentRevenue += amount;
        currentOrders += 1;
      }

      if (orderDate >= prevStartDate && orderDate < startDate) {
        prevRevenue += amount;
        prevOrders += 1;
      }
    });

    const calcPercent = (curr: number, prev: number) =>
      prev === 0 ? (curr > 0 ? 100 : 0) : ((curr - prev) / prev) * 100;

    const periodLabel =
      period === 'yearly'
        ? `Year ${now.getFullYear()}`
        : period === 'monthly'
          ? `${now.toLocaleString('en-US', { month: 'long' })} ${now.getFullYear()}`
          : `This Week`;

    return {
      period,
      periodLabel,
      revenue: currentRevenue,
      revenuePercent: calcPercent(currentRevenue, prevRevenue),
      orders: currentOrders,
      ordersPercent: calcPercent(currentOrders, prevOrders),
    };
  }

  async getOrders() {
    return this.orderRepository.find({
      relations: [
        'customer',
        'address',
        'orderItems',
        'orderItems.product',
        'orderItems.product.variants',
        'orderItems.product.productColors',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderDetail(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: [
        'customer',
        'address',
        'orderItems',
        'orderItems.product',
        'orderItems.product.variants',
        'orderItems.product.productColors',
      ],
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

  async deleteOrder(id: number) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Đơn hàng không tồn tại');
    return this.orderRepository.remove(order);
  }

  async deleteCustomer(id: number) {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('Khách hàng không tồn tại');
    return this.customerRepository.remove(customer);
  }

  async banCustomer(id: number) {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    customer.isBanned = true;
    await this.customerRepository.save(customer);
    return { message: 'Customer banned successfully' };
  }

  async unbanCustomer(id: number) {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    customer.isBanned = false;
    await this.customerRepository.save(customer);
    return { message: 'Customer unbanned successfully' };
  }
}
