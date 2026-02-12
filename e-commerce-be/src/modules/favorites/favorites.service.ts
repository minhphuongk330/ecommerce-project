import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm'; // Import IsNull
import { Favorite } from '../../entities/favorite.entity'; // Kiểm tra đường dẫn import entity
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  async create(customerId: number, createFavoriteDto: CreateFavoriteDto) {
    const { productId, variantId } = createFavoriteDto;

    // 1. Kiểm tra tồn tại (Dùng IsNull() để tìm kiếm chính xác)
    const existing = await this.favoriteRepository.findOne({
      where: {
        customerId,
        productId,
        variantId: variantId ? variantId : IsNull(),
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Sản phẩm này đã có trong danh sách yêu thích',
      );
    }

    // 2. Tạo mới
    const newFavorite = this.favoriteRepository.create({
      customerId,
      productId,
      // 👇 SỬA Ở ĐÂY: Bỏ '|| null'.
      // Nếu variantId undefined, TypeORM sẽ tự hiểu là không có giá trị (tương đương null trong DB)
      variantId: variantId, 
    });

    return await this.favoriteRepository.save(newFavorite);
  }

  async findAll(customerId: number) {
    return await this.favoriteRepository.find({
      where: { customerId },
      relations: ['product', 'variant'], // Load thêm variant để hiển thị
      order: { id: 'DESC' },
    });
  }

  async remove(customerId: number, productId: number, variantId?: number) {
    const item = await this.favoriteRepository.findOne({
      where: {
        customerId,
        productId,
      
        variantId: variantId ? variantId : IsNull(),
      },
    });

    if (item) {
      return await this.favoriteRepository.remove(item);
    }
    return;
  }
}