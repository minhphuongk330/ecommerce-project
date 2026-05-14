import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

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
  ) {
    return this.favoritesService.remove(req.user.id, productId);
  }
}
