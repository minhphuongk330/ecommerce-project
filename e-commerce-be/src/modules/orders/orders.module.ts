import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlashSaleItem } from '../../entities/flash-sale-item.entity';
import { Order } from '../../entities/order.entity';
import { Product } from '../../entities/product.entity';
import { Coupon } from '../../entities/coupon.entity';
import { CustomerCoupon } from '../../entities/customer-coupon.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, FlashSaleItem, Coupon, CustomerCoupon]), PassportModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule { }
