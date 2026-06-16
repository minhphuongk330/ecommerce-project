import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Tạo URL thanh toán VNPay từ payload checkout (chưa tạo order thực sự)
   * POST /payments/vnpay-checkout
   */
  @Post('vnpay-checkout')
  createVnpayCheckout(@Body() body: any, @Req() req: Request) {
    const ipAddr =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      '127.0.0.1';
    return this.paymentsService.createVnpayCheckout(body, ipAddr);
  }

  /**
   * Tạo URL thanh toán VNPay cho một order
   * POST /payments/create-url/:orderId
   */
  @Post('create-url/:orderId')
  createPaymentUrl(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Req() req: Request,
  ) {
    const ipAddr =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      '127.0.0.1';
    return this.paymentsService.createPaymentUrl(orderId, ipAddr);
  }

  /**
   * VNPay redirect về sau thanh toán (người dùng thấy)
   * GET /payments/vnpay-return
   */
  @Get('vnpay-return')
  handleReturn(@Query() query: Record<string, string>) {
    return this.paymentsService.handleReturnUrl(query);
  }

  /**
   * VNPay IPN — server-to-server callback
   * GET /payments/vnpay-ipn
   */
  @Get('vnpay-ipn')
  @HttpCode(HttpStatus.OK)
  handleIpn(@Query() query: Record<string, string>) {
    return this.paymentsService.handleIpn(query);
  }

  /**
   * Kiểm tra trạng thái thanh toán theo txnRef
   * GET /payments/status/:txnRef
   */
  @Get('status/:txnRef')
  getPaymentStatus(@Param('txnRef') txnRef: string) {
    return this.paymentsService.getPaymentStatus(txnRef);
  }
}
