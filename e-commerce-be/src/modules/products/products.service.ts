import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { EntityManager, Repository, SelectQueryBuilder, MoreThan } from 'typeorm';

import { Brand } from '../../entities/brand.entity';
import { Category } from '../../entities/category.entity';
import { Product } from '../../entities/product.entity';
import { FlashSaleItem } from '../../entities/flash-sale-item.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly entityManager: EntityManager,
  ) { }

  async findAll(options?: {
    sort?: string;
    categoryId?: number;
    name?: string;
    brand?: string;
    brandId?: number;
    page?: number;
    limit?: number;
    collection?: string;
    minPrice?: number;
    maxPrice?: number;
    [key: string]: any;
  }): Promise<{ items: Product[]; total: number }> {
    try {
      const {
        sort = 'newest',
        categoryId,
        name,
        brand,
        brandId,
        page = 1,
        limit = 9,
        collection,
        minPrice,
        maxPrice,
        flashSale,

        ...attributeFilters
      } = options || {};


      const attrFilters: Record<string, string> = {};
      Object.entries(attributeFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          attrFilters[key] = String(value);
        }
      });

      if (collection === 'New Arrival') {
        const query = this.productRepository
          .createQueryBuilder('product')
          .leftJoinAndSelect('product.category', 'category')
          .orderBy('product.createdAt', 'DESC')
          .take(limit);
        const items = await query.getMany();
        return { items, total: items.length };
      }

      if (collection === 'Bestseller') {
        const items = await this.productRepository
          .createQueryBuilder('product')
          .leftJoinAndSelect('product.category', 'category')
          .addSelect(
            (sub) =>
              sub
                .select('COALESCE(SUM(oi.quantity), 0)', 'totalSold')
                .from('order_items', 'oi')
                .where('oi.product_id = product.id'),
            'totalSold',
          )
          .orderBy('totalSold', 'DESC')
          .take(limit)
          .getMany();
        return { items, total: items.length };
      }

      const query = this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .where('product.isActive = :isActive', { isActive: true });

      let flashSaleItems: FlashSaleItem[] = [];
      if (flashSale === 'true' || flashSale === true) {
        const now = new Date();
        flashSaleItems = await this.entityManager.find(FlashSaleItem, {
          where: {
            flashSale: {
              isActive: true,
              endsAt: MoreThan(now)
            }
          },
          relations: ['flashSale']
        });

        const productIds = flashSaleItems.map(item => Number(item.productId));
        if (productIds.length === 0) {
          return { items: [], total: 0 };
        }
        query.andWhere('product.id IN (:...fsProductIds)', { fsProductIds: productIds });
      }

      if (name) {
        query.andWhere('product.name LIKE :name', { name: `%${name}%` });
      }

      if (categoryId) {

        const catId = Number(categoryId);
        if (!isNaN(catId)) {
          query.andWhere('product.category_id = :categoryId', { categoryId: catId });
        }
      }

      if (brandId) {

        const bId = Number(brandId);
        if (!isNaN(bId)) {
          query.andWhere('product.brand_id = :brandId', { brandId: bId });
        }
      }

      if (brand) {

        attrFilters['brand'] = brand;
      }

      if (minPrice !== undefined) {
        query.andWhere('product.price >= :minPrice', { minPrice });
      }

      if (maxPrice !== undefined) {
        query.andWhere('product.price <= :maxPrice', { maxPrice });
      }

      this.applyDynamicFilters(query, attrFilters);

      if (collection === 'Featured Products') {
        query.andWhere('product.isFeatured = :isFeatured', { isFeatured: true });
      }


      this.applySafeSorting(query, sort);

      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);



      try {
        const [items, total] = await query.getManyAndCount();
        
        if (flashSale === 'true' || flashSale === true) {
          const enrichedItems = items.map(product => {
            const fsItem = flashSaleItems.find(item => Number(item.productId) === Number(product.id));
            if (fsItem) {
              return {
                ...product,
                isFlashSale: true,
                flashSalePrice: Number(fsItem.salePrice),
                flashSaleOriginalPrice: Number(fsItem.originalPrice),
                quantity: Number(fsItem.quantity),
                soldQuantity: Number(fsItem.soldQuantity)
              } as any;
            }
            return product;
          });
          return { items: enrichedItems, total };
        }
        
        return { items, total };
      } catch (dbError) {
        console.error('Database error in getManyAndCount:', dbError);
        this.logger.error(`Database error: ${dbError.message}`, dbError.stack);
        throw dbError;
      }
    } catch (error) {
      this.logger.error(`Error in findAll: ${error.message}`, error.stack);
      console.error('Full error in findAll:', error);
      return { items: [], total: 0 };
    }
  }


  private readonly validSortColumns = ['id', 'name', 'price', 'createdAt', 'updatedAt', 'stock'];

  private applySafeSorting(query: SelectQueryBuilder<Product>, sort: string): void {

    const defaultSort = { column: 'product.id', direction: 'DESC' as const };

    switch (sort) {
      case 'price_asc':
      case 'price_ascending':
        query.orderBy('product.price', 'ASC');
        break;
      case 'price_desc':
      case 'price_descending':
        query.orderBy('product.price', 'DESC');
        break;
      case 'name_asc':
      case 'name_ascending':
        query.orderBy('product.name', 'ASC');
        break;
      case 'name_desc':
      case 'name_descending':
        query.orderBy('product.name', 'DESC');
        break;
      case 'soldCount':
      case 'sold_count':
      case 'bestseller':
        query
          .addSelect(
            (sub) =>
              sub
                .select('COALESCE(SUM(oi.quantity), 0)', 'soldCount')
                .from('order_items', 'oi')
                .where('oi.product_id = product.id'),
            'soldCount',
          )
          .orderBy('soldCount', 'DESC');
        break;
      case 'rating':
        query
          .addSelect((sub) => {
            return sub
              .select('COALESCE(AVG(r.rating), 0)', 'avgRating')
              .from('product_reviews', 'r')
              .where('r.product_id = product.id');
          }, 'avgRating')
          .orderBy('avgRating', 'DESC');
        break;
      case 'newest':
      case 'createdAt':
      case 'created_at':
        query.orderBy('product.createdAt', 'DESC');
        break;
      case 'oldest':
        query.orderBy('product.createdAt', 'ASC');
        break;
      default:

        if (sort && this.validSortColumns.includes(sort)) {
          query.orderBy(`product.${sort}`, 'DESC');
        } else {

          query.orderBy(defaultSort.column, defaultSort.direction);
        }
        break;
    }
  }

  private applyDynamicFilters(
    query: SelectQueryBuilder<Product>,
    filters: Record<string, string>,
  ): void {

    const directColumns = ['color'];
    let paramIndex = 0;

    Object.entries(filters).forEach(([key, value]) => {
      const values = value.split(',').filter(Boolean);
      if (values.length === 0) return;

      const safeKey = `filter_${paramIndex}`;

      if (directColumns.includes(key)) {
        this.applyDirectColumnFilter(query, key, values, safeKey);
      } else {
        this.applyJsonSpecificationFilter(query, key, values, safeKey);
      }
      paramIndex++;
    });
  }

  private applyDirectColumnFilter(
    query: SelectQueryBuilder<Product>,
    column: string,
    values: string[],
    paramKey: string,
  ): void {
    if (values.length === 1) {
      query.andWhere(`product.${column} = :${paramKey}`, {
        [paramKey]: values[0],
      });
    } else {
      query.andWhere(`product.${column} IN (:...${paramKey})`, {
        [paramKey]: values,
      });
    }
  }

  private applyJsonSpecificationFilter(
    query: SelectQueryBuilder<Product>,
    key: string,
    values: string[],
    paramKey: string,
  ): void {
    const jsonPath = `$.${key}`;


    if (values.length === 1) {
      query.andWhere(
        `COALESCE(JSON_UNQUOTE(JSON_EXTRACT(product.specifications, :${paramKey}_path)), '') LIKE :${paramKey}_val`,
        {
          [`${paramKey}_path`]: jsonPath,
          [`${paramKey}_val`]: `%${values[0]}%`,
        },
      );
    } else {
      const orConditions = values.map(
        (_, i) =>
          `COALESCE(JSON_UNQUOTE(JSON_EXTRACT(product.specifications, :${paramKey}_path)), '') LIKE :${paramKey}_val${i}`,
      );
      const params: Record<string, any> = {
        [`${paramKey}_path`]: jsonPath,
      };
      values.forEach((v, i) => {
        params[`${paramKey}_val${i}`] = `%${v}%`;
      });
      query.andWhere(`(${orConditions.join(' OR ')})`, params);
    }
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: [
        'category',
        'reviews',
        'reviews.customer',
      ],
    });
    if (!product)
      throw new NotFoundException(`Không tìm thấy Sản phẩm với ID ${id}`);
    return product;
  }

  async getActiveFlashSaleItem(productId: number): Promise<FlashSaleItem | null> {
    const now = new Date();
    return this.entityManager.findOne(FlashSaleItem, {
      where: {
        productId,
        flashSale: {
          isActive: true,
          endsAt: MoreThan(now),
        },
      },
      relations: ['flashSale'],
    });
  }

  /**
   * Lấy toàn bộ sản phẩm đang được sale trong 1 query duy nhất.
   * Trả về Map<productId, salePrice> để lookup O(1) khi build context chatbot.
   */
  async getActiveSalePriceMap(): Promise<Map<number, { salePrice: number; quantity: number; soldQuantity: number }>> {
    const now = new Date();
    const items = await this.entityManager.find(FlashSaleItem, {
      where: {
        flashSale: {
          isActive: true,
          endsAt: MoreThan(now),
        },
      },
      relations: ['flashSale'],
    });
    const map = new Map<number, { salePrice: number; quantity: number; soldQuantity: number }>();
    items.forEach((item) =>
      map.set(Number(item.productId), {
        salePrice: Number(item.salePrice),
        quantity: Number(item.quantity),
        soldQuantity: Number(item.soldQuantity),
      }),
    );
    return map;
  }

  async searchByKeywords(keywords: string[]): Promise<Product[]> {
    if (keywords.length === 0) {
      return this.productRepository.find({
        where: { isActive: true },
        relations: ['category'],
        order: { createdAt: 'DESC' },
        take: 20,
      });
    }


    const categoryQuery = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = :isActive', { isActive: true });

    const categoryConditions = keywords.map((kw, i) => `category.name LIKE :catKw${i}`);
    const categoryParams: Record<string, string> = {};
    keywords.forEach((kw, i) => { categoryParams[`catKw${i}`] = `%${kw}%`; });

    categoryQuery.andWhere(`(${categoryConditions.join(' OR ')})`, categoryParams);
    const byCategory = await categoryQuery.take(20).getMany();

    if (byCategory.length > 0) {
      return byCategory;
    }


    const productQuery = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = :isActive', { isActive: true });

    const productConditions = keywords.map((kw, i) => `product.name LIKE :prodKw${i}`);
    const productParams: Record<string, string> = {};
    keywords.forEach((kw, i) => { productParams[`prodKw${i}`] = `%${kw}%`; });

    productQuery.andWhere(`(${productConditions.join(' OR ')})`, productParams);
    return productQuery.take(20).getMany();
  }

  /**
   * Tìm sản phẩm bán chạy nhất, dùng cho tính năng gợi ý của chatbot.
   * @param categoryName - Tên danh mục cần lọc (tùy chọn, dùng LIKE)
   * @param limit - Số lượng sản phẩm trả về (mặc định 1)
   */
  async getBestSellers(categoryName?: string, limit = 1): Promise<{ product: Product; totalSold: number }[]> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .addSelect(
        (sub) =>
          sub
            .select('COALESCE(SUM(oi.quantity), 0)', 'totalSold')
            .from('order_items', 'oi')
            .where('oi.product_id = product.id'),
        'totalSold',
      )
      .where('product.isActive = :isActive', { isActive: true })
      .andWhere('product.stock > 0');

    if (categoryName) {
      query.andWhere('category.name LIKE :catName', { catName: `%${categoryName}%` });
    }

    const rawResults = await query
      .orderBy('totalSold', 'DESC')
      .limit(limit)
      .getRawAndEntities();

    return rawResults.entities.map((product, i) => ({
      product,
      totalSold: Number(rawResults.raw[i]?.totalSold ?? 0),
    }));
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save(product);
    return savedProduct;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    await this.productRepository.save(product);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async getPriceRange(
    categoryId?: number,
  ): Promise<{ minPrice: number; maxPrice: number }> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .select('MIN(product.price)', 'minPrice')
      .addSelect('MAX(product.price)', 'maxPrice');

    if (categoryId) {
      const catId = Number(categoryId);
      if (!isNaN(catId)) {
        query.where('product.category_id = :categoryId', { categoryId: catId });
      }
    }

    const result = await query.getRawOne();
    return {
      minPrice: Math.floor(Number(result?.minPrice ?? 0)),
      maxPrice: Math.ceil(Number(result?.maxPrice ?? 10000)),
    };
  }

  async seedData() {
    const filePath = path.join(process.cwd(), 'seed-laptops.json');
    if (!fs.existsSync(filePath)) return "Không tìm thấy file seed-laptops.json!";

    const fileData = fs.readFileSync(filePath, 'utf-8');
    const rawProducts = JSON.parse(fileData);

    let count = 0;
    for (const item of rawProducts) {
      let category = await this.entityManager.findOne(Category, { where: { name: item.category } });
      if (!category) {
        category = this.entityManager.create(Category, { name: item.category });
        await this.entityManager.save(Category, category);
      }

      let brand: Brand | null = null;
      if (item.brand) {
        brand = await this.entityManager.findOne(Brand, { where: { name: item.brand } });
        if (!brand) {
          brand = this.entityManager.create(Brand, { name: item.brand });
          await this.entityManager.save(Brand, brand);
        }
      }

      const productExist = await this.entityManager.findOne(Product, { where: { name: item.name } });
      if (!productExist) {
        const newProduct = this.entityManager.create(Product, {
          name: item.name,
          price: item.price,
          mainImageUrl: item.mainImageUrl,
          color: item.color || null,
          specifications: item.specifications || null,
          description: item.description,
          isActive: item.isActive,
          stock: 50,
          category: category,
          ...(brand && { brand: brand }),
        });
        await this.entityManager.save(Product, newProduct);
        count++;
      }
    }
    return `🎉 Tuyệt vời! Đã seed thành công ${count} laptop vào Database!`;
  }
}