import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  /** Public: lấy coupon hiển thị trang chủ */
  @Get('homepage')
  findHomepage() {
    return this.couponsService.findHomepage();
  }

  /** Public: validate mã giảm giá */
  @Post('validate')
  validate(@Body() body: { code: string; orderValue: number; shippingCost?: number; customerId?: number }) {
    return this.couponsService.validate(body.code, body.orderValue, body.shippingCost ?? 0, body.customerId);
  }

  /** Admin: lấy tất cả */
  @Get()
  findAll() {
    return this.couponsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.couponsService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.couponsService.create(body);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.couponsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.couponsService.remove(id);
  }
}
