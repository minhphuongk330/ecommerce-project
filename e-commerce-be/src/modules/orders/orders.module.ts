import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../entities/order.entity';
import { Product } from '../../entities/product.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ProductVariant } from '../../entities/product-variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, ProductVariant]), PassportModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
