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
  Query,
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
    return this.favoritesService.create(req.user.id, createFavoriteDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.favoritesService.findAll(req.user.id);
  }

  @Delete(':id')
  remove(
    @Request() req,
    @Param('id', ParseIntPipe) productId: number,
    @Query('variantId') variantId?: string,
  ) {
    const vId = variantId ? parseInt(variantId) : undefined;

    return this.favoritesService.remove(req.user.id, productId, vId);
  }
}
