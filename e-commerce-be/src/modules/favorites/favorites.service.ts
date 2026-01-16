import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../../entities/favorite.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  async create(customerId: number, createFavoriteDto: CreateFavoriteDto) {
    const { productId } = createFavoriteDto;

    const existing = await this.favoriteRepository.findOne({
      where: { customerId, productId },
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
    return await this.favoriteRepository.find({
      where: { customerId },
      relations: ['product'],
      order: { id: 'DESC' },
    });
  }

  async remove(customerId: number, productId: number) {
    const item = await this.favoriteRepository.findOne({
      where: { customerId, productId },
    });

    if (item) {
      return await this.favoriteRepository.remove(item);
    }
    return;
  }
}
