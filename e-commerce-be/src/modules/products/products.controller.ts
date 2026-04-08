import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get('price-range')
  getPriceRange(@Query('categoryId') categoryId?: string) {
    return this.productsService.getPriceRange(
      categoryId ? parseInt(categoryId) : undefined,
    );
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    const { sort, categoryId, name, page, limit, collection, minPrice, maxPrice, ...rest } = query;
    return this.productsService.findAll({
      sort,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      name,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      collection,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      ...rest,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
