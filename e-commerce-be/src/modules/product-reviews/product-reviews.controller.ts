import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductReviewsService } from './product-reviews.service';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('product-reviews')
export class ProductReviewsController {
  constructor(
    private readonly productReviewsService: ProductReviewsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createProductReviewDto: CreateProductReviewDto,
    @Request() req: any,
  ) {
    return this.productReviewsService.create(
      createProductReviewDto,
      req.user.id,
    );
  }

  @Get()
  findAll(@Query('productId') productId?: string) {
    const productIdNum = productId ? parseInt(productId, 10) : undefined;
    return this.productReviewsService.findAll(productIdNum);
  }

  @Get('product/:productId')
  findByProductId(@Param('productId', ParseIntPipe) productId: number) {
    return this.productReviewsService.findByProductId(productId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productReviewsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductReviewDto: UpdateProductReviewDto,
    @Request() req: any,
  ) {
    return this.productReviewsService.update(
      id,
      updateProductReviewDto,
      req.user.id,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.productReviewsService.remove(id, req.user.id);
  }
}

