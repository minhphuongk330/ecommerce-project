import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerCoupon } from '../../entities/customer-coupon.entity';
import { Coupon } from '../../entities/coupon.entity';
import { CustomerCouponsController } from './customer-coupons.controller';
import { CustomerCouponsService } from './customer-coupons.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerCoupon, Coupon])],
  controllers: [CustomerCouponsController],
  providers: [CustomerCouponsService],
  exports: [CustomerCouponsService],
})
export class CustomerCouponsModule {}
