import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from '../../entities/product.entity';
import { ProductColor } from 'src/entities/product-color.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product,ProductColor])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}

