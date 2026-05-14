import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CustomerCouponsService } from './customer-coupons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('customer-coupons')
@UseGuards(JwtAuthGuard)
export class CustomerCouponsController {
  constructor(private readonly service: CustomerCouponsService) {}

  /** Thu thập coupon */
  @Post(':couponId')
  collect(
    @Param('couponId', ParseIntPipe) couponId: number,
    @Request() req: any,
  ) {
    return this.service.collect(req.user.id, couponId);
  }

  /** Lấy danh sách coupon đã thu thập */
  @Get()
  findMine(@Request() req: any) {
    return this.service.findByCustomer(req.user.id);
  }

  /** Lấy danh sách couponId đã thu thập (để check trạng thái nút) */
  @Get('collected-ids')
  getCollectedIds(@Request() req: any) {
    return this.service.getCollectedIds(req.user.id);
  }

  /** Xóa coupon đã thu thập */
  @Delete(':couponId')
  remove(
    @Param('couponId', ParseIntPipe) couponId: number,
    @Request() req: any,
  ) {
    return this.service.remove(req.user.id, couponId);
  }
}
