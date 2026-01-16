import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { Banner } from '../entities/banner.entity';
import { ProductImage } from '../entities/product-image.entity';
import { ProductColor } from '../entities/product-color.entity';
import { AttributeDef } from '../entities/attribute-def.entity';
import { Customer } from '../entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Product,
      Banner,
      ProductImage,
      ProductColor,
      AttributeDef,
      Customer,
    ]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}

