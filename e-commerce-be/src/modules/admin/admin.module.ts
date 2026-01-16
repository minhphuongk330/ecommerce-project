import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Order } from '../../entities/order.entity';
import { Product } from '../../entities/product.entity';
import { Customer } from '../../entities/customer.entity';
import { Category } from 'src/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, Customer,Category])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
