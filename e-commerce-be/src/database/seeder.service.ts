import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { Banner } from '../entities/banner.entity';
import { ProductImage } from '../entities/product-image.entity';
import { ProductColor } from '../entities/product-color.entity';
import { AttributeDef } from '../entities/attribute-def.entity';
import { Customer } from '../entities/customer.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectRepository(ProductColor)
    private readonly productColorRepository: Repository<ProductColor>,
    @InjectRepository(AttributeDef)
    private readonly attributeDefRepository: Repository<AttributeDef>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async seed(): Promise<void> {
    this.logger.log('Starting database seeding...');

    try {
      await this.seedCategories();
      await this.seedProducts();
      await this.seedBanners();
      await this.seedProductImages();
      await this.seedProductColors();
      await this.seedAttributeDefs();
      await this.seedCustomers();

      this.logger.log('Database seeding completed successfully!');
    } catch (error) {
      this.logger.error('Error seeding database:', error);
      throw error;
    }
  }

  private async seedCategories(): Promise<void> {
    const count = await this.categoryRepository.count();
    if (count > 0) {
      this.logger.log('Categories already exist, skipping...');
      return;
    }

    const categories = [
      {
        name: 'Điện thoại',
        thumbnailUrl: 'https://i.ibb.co/gMMBfB8Y/Phones.png',
        configs: `{"size": "", "main_camera": "", "front_camera": "", "battery": "", "ram": "", "storage": "", "brand": ""}`,
      },
      {
        name: 'Laptop',
        thumbnailUrl: 'https://i.ibb.co/8LPtt7yN/Computers.png',
        configs: `{"size": "", "cpu": "", "ram": "", "storage": "", "brand": ""}`,
      },
      {
        name: 'Tai nghe',
        thumbnailUrl: 'https://i.ibb.co/9HGvq8Y4/Headphones.png',
        configs: `{"size": "", "battery": "", "brand": ""}`,
      },
      {
        name: 'Máy ảnh',
        thumbnailUrl: 'https://i.ibb.co/rKJmXmxM/Cameras.png',
        configs: `{"size": "", "battery": "", "brand": ""}`,
      },
      {
        name: 'Đồng hồ',
        thumbnailUrl: 'https://i.ibb.co/3Yp4JJv2/Smart-Watches.png',
        configs: `{"size": "", "battery": "", "brand": ""}`,
      },
      {
        name: 'Gaming',
        thumbnailUrl: 'https://i.ibb.co/NngtncFp/Gaming.png',
        configs: `{"size": "", "battery": "", "brand": ""}`,
      },
    ];

    await this.categoryRepository.save(categories);
    this.logger.log(`Seeded ${categories.length} categories`);
  }

  private async seedProducts(): Promise<void> {
    const count = await this.productRepository.count();
    if (count > 0) {
      this.logger.log('Products already exist, skipping...');
      return;
    }

    const categories = await this.categoryRepository.find();
    if (categories.length === 0) {
      this.logger.warn('No categories found, skipping products seed');
      return;
    }

    const product = {
      name: 'iPhone 15 Pro Max',
      categoryId: categories[0].id,
      shortDescription: 'Enhanced capabilities thanks toan enlarged display of 6.7 inchesand work without rechargingthroughout the day. Incredible photosas in weak, yesand in bright lightusing the new systemwith two cameras',
      description:
        'Just as a book is judged by its cover, the first thing you notice when you pick up a modern smartphone is the display. Nothing surprising, because advanced technologies allow you to practically level the display frames and cutouts for the front camera and speaker, leaving no room for bold design solutions. And how good that in such realities Apple everything is fine with displays. Both critics and mass consumers always praise the quality of the picture provided by the products of the Californian brand. And last years 6.7-inch Retina panels, which had ProMotion, caused real admiration for many.',
      price: 1999,
      stock: 50,
      mainImageUrl: 'https://i.ibb.co/qLt7qTp7/image.png',
      extraImage1: 'https://i.ibb.co/1tw5RjND/image.png',
      extraImage2: 'https://i.ibb.co/8gStpm6Q/image.png',
      extraImage3: 'https://i.ibb.co/7tm3jFhQ/image.png',
      isActive: true,
      attribute: `[
        {
          "key": "screen_diagonal",
          "name": "Screen diagonal",
          "value": "6.7""
        },
        {
          "key": "screen_resolution",
          "name": "The screen resolution",
          "value": "2796×1290"
        },
        {
          "key": "screen_refresh_rate",
          "name": "The screen refresh rate",
          "value": "120 Hz"
        },
        {
          "key": "pixel_density",
          "name": "The pixel density",
          "value": "460 ppi"
        },
        {
          "key": "screen_type",
          "name": "Screen type",
          "value": "OLED"
        },
        {
          "key": "additionally",
          "name": "Additionally",
          "value": [
            "Dynamic Island",
            "Always-On display",
            "HDR display",
            "True Tone",
            "Wide color (P3)"
          ]
        },
        {
          "key": "cpu",
          "name": "CPU",
          "value": "A16 Bionic"
        },
        {
          "key": "number_of_cores",
          "name": "Number of cores",
          "value": 6
        }
      ]`,
    };

    const products: Partial<Product>[] = [];
    for (let i = 0; i < 30; i++) {
      products.push({
        ...product,
        name: `iPhone 15 Pro Max (${i + 1})`,
      });
    }
    await this.productRepository.save(products);
    this.logger.log(`Seeded ${products.length} products`);
  }

  private async seedBanners(): Promise<void> {
    const count = await this.bannerRepository.count();
    if (count > 0) {
      this.logger.log('Banners already exist, skipping...');
      return;
    }

    const banners = [
      {
        title: 'IPhone 14 Pro',
        content: 'Created to change everything for the better. For everyone',
        imageUrl:
          'https://i.ibb.co/4hz9x39/image.png',
        isActive: true,
        displayType: '1',
      },
      {
        title: '',
        content: '',
        imageUrl:
          'https://i.ibb.co/mCWmVfHS/image.png',
        isActive: true,
        displayType: '2',
      },
      {
        title: 'Macbook Air',
        content: 'The new 15‑inch MacBook Air makes room for more of what you love with a spacious Liquid Retina display.',
        imageUrl:
          'https://i.ibb.co/B28DK4XG/image.png',
        isActive: true,
        displayType: '2',
      },
      {
        title: 'Ipad Pro',
        content: 'iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.',
        imageUrl:
          'https://i.ibb.co/1YDg2c5J/image.png',
        isActive: true,
        displayType: '3',
      },
      {
        title: 'Samsung Galaxy',
        content: 'iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.',
        imageUrl:
          'https://i.ibb.co/1YDg2c5J/image.png',
        isActive: true,
        displayType: '3',
      },
      {
        title: 'Popular Products',
        content: 'iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.',
        imageUrl:
          'https://i.ibb.co/1YDg2c5J/image.png',
        isActive: true,
        displayType: '3',
      },
      {
        title: 'Macbook Pro',
        content: 'iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.',
        imageUrl:
          'https://i.ibb.co/1YDg2c5J/image.png',
        isActive: true,
        displayType: '3',
      },
      {
        title: 'Big Summer Sale',
        content: 'Commodo fames vitae vitae leo mauris in. Eu consequat.',
        imageUrl:
          'https://i.ibb.co/1YDg2c5J/image.png',
        isActive: true,
        displayType: '4',
      },
    ];

    await this.bannerRepository.save(banners);
    this.logger.log(`Seeded ${banners.length} banners`);
  }

  private async seedProductImages(): Promise<void> {
    const count = await this.productImageRepository.count();
    if (count > 0) {
      this.logger.log('Product images already exist, skipping...');
      return;
    }

    const products = await this.productRepository.find();
    if (products.length === 0) {
      this.logger.warn('No products found, skipping product images seed');
      return;
    }

    const productImages: Array<{
      productId: number;
      url: string;
      ordinal: number;
      isPrimary: boolean;
    }> = [];
    for (const product of products) {
      productImages.push(
        {
          productId: product.id,
          url: product.mainImageUrl,
          ordinal: 0,
          isPrimary: true,
        },
        {
          productId: product.id,
          url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800',
          ordinal: 1,
          isPrimary: false,
        },
        {
          productId: product.id,
          url: 'https://images.unsplash.com/photo-1601972602237-8a1535f4af75?w=800',
          ordinal: 2,
          isPrimary: false,
        },
      );
    }

    await this.productImageRepository.save(productImages);
    this.logger.log(`Seeded ${productImages.length} product images`);
  }

  private async seedProductColors(): Promise<void> {
    const count = await this.productColorRepository.count();
    if (count > 0) {
      this.logger.log('Product colors already exist, skipping...');
      return;
    }

    const products = await this.productRepository.find();
    if (products.length === 0) {
      this.logger.warn('No products found, skipping product colors seed');
      return;
    }

    const productColors: Array<{
      productId: number;
      colorName: string;
      colorHex: string;
    }> = [];
    const colorOptions = [
      { name: 'Đen', hex: '#000000' },
      { name: 'Trắng', hex: '#FFFFFF' },
      { name: 'Xanh dương', hex: '#0066CC' },
      { name: 'Xanh lá', hex: '#00CC66' },
      { name: 'Đỏ', hex: '#CC0000' },
      { name: 'Vàng', hex: '#FFCC00' },
      { name: 'Hồng', hex: '#FF99CC' },
      { name: 'Titan', hex: '#C0C0C0' },
    ];

    for (const product of products) {
      const numColors = Math.floor(Math.random() * 3) + 2; // 2-4 colors per product
      const selectedColors = colorOptions
        .sort(() => Math.random() - 0.5)
        .slice(0, numColors);

      for (const color of selectedColors) {
        productColors.push({
          productId: product.id,
          colorName: color.name,
          colorHex: color.hex,
        });
      }
    }

    await this.productColorRepository.save(productColors);
    this.logger.log(`Seeded ${productColors.length} product colors`);
  }

  private async seedAttributeDefs(): Promise<void> {
    const count = await this.attributeDefRepository.count();
    if (count > 0) {
      this.logger.log('Attribute definitions already exist, skipping...');
      return;
    }

    const categories = await this.categoryRepository.find();
    if (categories.length === 0) {
      this.logger.warn('No categories found, skipping attribute defs seed');
      return;
    }

    const attributeDefs = [
      {
        name: 'RAM',
        categoryId: categories[0].id, // Điện thoại
        value: '8GB, 12GB, 16GB',
      },
      {
        name: 'Bộ nhớ',
        categoryId: categories[0].id,
        value: '128GB, 256GB, 512GB, 1TB',
      },
      {
        name: 'Màn hình',
        categoryId: categories[0].id,
        value: '6.1 inch, 6.7 inch, 6.8 inch',
      },
      {
        name: 'CPU',
        categoryId: categories[1].id, // Laptop
        value: 'Intel Core i5, i7, i9 / AMD Ryzen 5, 7, 9',
      },
      {
        name: 'RAM',
        categoryId: categories[1].id,
        value: '8GB, 16GB, 32GB, 64GB',
      },
      {
        name: 'Ổ cứng',
        categoryId: categories[1].id,
        value: '256GB SSD, 512GB SSD, 1TB SSD',
      },
      {
        name: 'Kết nối',
        categoryId: categories[2].id, // Tai nghe
        value: 'Bluetooth 5.0, 5.1, 5.2, 5.3',
      },
      {
        name: 'Pin',
        categoryId: categories[2].id,
        value: '20 giờ, 30 giờ, 40 giờ',
      },
    ];

    await this.attributeDefRepository.save(attributeDefs);
    this.logger.log(`Seeded ${attributeDefs.length} attribute definitions`);
  }

  private async seedCustomers(): Promise<void> {
    const count = await this.customerRepository.count();
    if (count > 0) {
      this.logger.log('Customers already exist, skipping...');
      return;
    }

    const hashedPassword = await bcrypt.hash('password123', 10);

    const customers = [
      {
        email: 'admin@example.com',
        passwordHash: hashedPassword,
        fullName: 'Admin User',
        isActive: true,
      },
      {
        email: 'customer1@example.com',
        passwordHash: hashedPassword,
        fullName: 'Nguyễn Văn A',
        isActive: true,
      },
      {
        email: 'customer2@example.com',
        passwordHash: hashedPassword,
        fullName: 'Trần Thị B',
        isActive: true,
      },
    ];

    await this.customerRepository.save(customers);
    this.logger.log(`Seeded ${customers.length} customers`);
  }
}
