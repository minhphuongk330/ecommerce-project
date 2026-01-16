import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductColorsService } from './product-colors.service';
import { ProductColorsController } from './product-colors.controller';
import { ProductColor } from '../../entities/product-color.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductColor])],
  controllers: [ProductColorsController],
  providers: [ProductColorsService],
  exports: [ProductColorsService],
})
export class ProductColorsModule {}

