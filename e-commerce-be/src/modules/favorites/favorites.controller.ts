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
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  create(@Request() req, @Body() createFavoriteDto: CreateFavoriteDto) {
    const customerId = req.user.id;
    return this.favoritesService.create(customerId, createFavoriteDto);
  }

  @Get()
  findAll(@Request() req) {
    const customerId = req.user.id;
    return this.favoritesService.findAll(customerId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id', ParseIntPipe) productId: number) {
    const customerId = req.user.id;
    return this.favoritesService.remove(customerId, productId);
  }
}
