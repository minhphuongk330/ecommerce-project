import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlashSale } from '../../entities/flash-sale.entity';
import { FlashSaleItem } from '../../entities/flash-sale-item.entity';
import { FlashSalesController } from './flash-sales.controller';
import { FlashSalesService } from './flash-sales.service';

@Module({
  imports: [TypeOrmModule.forFeature([FlashSale, FlashSaleItem])],
  controllers: [FlashSalesController],
  providers: [FlashSalesService],
  exports: [FlashSalesService],
})
export class FlashSalesModule {}
