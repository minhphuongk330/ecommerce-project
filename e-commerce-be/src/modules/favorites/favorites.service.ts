import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';
import { Favorite } from '../../entities/favorite.entity';
import { FlashSaleItem } from '../../entities/flash-sale-item.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) { }

  async create(customerId: number, createFavoriteDto: CreateFavoriteDto) {
    const { productId } = createFavoriteDto;

    const existing = await this.favoriteRepository.findOne({
      where: {
        customerId,
        productId,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Sản phẩm này đã có trong danh sách yêu thích',
      );
    }

    const newFavorite = this.favoriteRepository.create({
      customerId,
      productId,
    });

    return await this.favoriteRepository.save(newFavorite);
  }

  async findAll(customerId: number) {
    const favorites = await this.favoriteRepository.find({
      where: { customerId },
      relations: ['product'],
      order: { id: 'DESC' },
    });

    if (favorites.length === 0) return [];

    const productIds = favorites.map((fav) => fav.product.id);
    const now = new Date();

    // Query active flash sale items for these product IDs in a single batch
    const activeFlashSaleItems = await this.favoriteRepository.manager.find(
      FlashSaleItem,
      {
        where: {
          productId: In(productIds),
          flashSale: {
            isActive: true,
            endsAt: MoreThan(now),
          },
        },
        relations: ['flashSale'],
      },
    );

    // Map by productId for O(1) lookup
    const saleMap = new Map<number, FlashSaleItem>();
    for (const item of activeFlashSaleItems) {
      saleMap.set(Number(item.productId), item);
    }

    return favorites.map((fav) => {
      const saleItem = saleMap.get(fav.product.id);
      return {
        ...fav,
        product: {
          ...fav.product,
          isFlashSale: !!saleItem,
          flashSalePrice: saleItem ? Number(saleItem.salePrice) : undefined,
          flashSaleOriginalPrice: saleItem
            ? Number(saleItem.originalPrice)
            : undefined,
        },
      };
    });
  }

  async remove(customerId: number, productId: number) {
    const item = await this.favoriteRepository.findOne({
      where: {
        customerId,
        productId,
      },
    });

    if (item) {
      return await this.favoriteRepository.remove(item);
    }
    return;
  }
}
