import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  Query, // 👈 Import Query
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
// Import Guard của bạn (giữ nguyên như cũ)
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 

@Controller('favorites')
@UseGuards(JwtAuthGuard) // Giữ nguyên Guard của bạn
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  create(@Request() req, @Body() createFavoriteDto: CreateFavoriteDto) {
    // Dùng req.user.id hoặc field nào chứa ID khách hàng trong token của bạn
    // Ở đoạn code trước bạn dùng req.user.id nên tôi giữ nguyên
    return this.favoritesService.create(req.user.id, createFavoriteDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.favoritesService.findAll(req.user.id);
  }

  // 👇 Sửa API Xóa để nhận variantId
  @Delete(':id')
  remove(
    @Request() req, 
    @Param('id', ParseIntPipe) productId: number,
    @Query('variantId') variantId?: string // Nhận từ ?variantId=...
  ) {
    // Chuyển string sang number nếu có
    const vId = variantId ? parseInt(variantId) : undefined;
    
    return this.favoritesService.remove(req.user.id, productId, vId);
  }
}